"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  InfiniteData,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";

import {
  api,
  DirectMessageWithSortedReactions,
  MessageWithSortedReactions,
} from "@workspace/api";

type MessageBase = {
  messageId?: string;
  content?: string;
  fileUrl?: string;
  value?: string;
  user?: {
    id: string;
    image: string;
  };
};

type ChatMessage = MessageBase & {
  serverId?: string;
  channelId?: string;
};

type ConversationMessage = MessageBase & {
  conversationId?: string;
  targetId?: string;
};

type WebSocketMessageType =
  | "join-chat"
  | "leave-chat"
  | "create-message-chat"
  | "edit-message-chat"
  | "delete-message-chat"
  | "create-message-reaction"
  | "join-conversation"
  | "create-message-conversation"
  | "edit-message-conversation"
  | "delete-message-conversation"
  | "create-reaction-conversation";

export type WebSocketMessage = {
  type: WebSocketMessageType;
  data: ChatMessage | ConversationMessage;
};

type NotificationState = {
  servers: Record<string, { hasNotification: boolean }>;
  conversations: Record<string, { count: number; image?: string }>;
};

type WebSocketContextType = {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => boolean;
  leave: (params: {
    channelId?: string;
    serverId?: string;
    targetId?: string;
  }) => boolean;
  join: (params: {
    channelId?: string;
    serverId?: string;
    targetId?: string;
  }) => boolean;
  sendChatMessage: (data: ChatMessage) => boolean;
  editChatMessage: (data: ChatMessage) => boolean;
  deleteChatMessage: (data: ChatMessage) => boolean;
  createMessageReaction: (data: ChatMessage) => boolean;
  notifications: NotificationState;
  currentServerId: string | null;
  clearServerNotifications: (serverId: string) => void;
  setCurrentServer: (serverId: string) => void;
  sendConversationMessage: (data: ConversationMessage) => void;
  editConversationMessage: (data: ConversationMessage) => void;
  deleteConversationMessage: (data: ConversationMessage) => void;
  createDirectMessageReaction: (data: ConversationMessage) => void;
  clearConversationNotifications: (targetId: string) => void;
};

type EdenWebSocket = ReturnType<typeof api.ws.chat.subscribe>;

const updateMessageData = <T extends PageData | ConversationPageData>(
  oldData: InfiniteData<T> | undefined,
  updater: (messages: T["messages"]) => T["messages"],
): InfiniteData<T> | undefined => {
  if (!oldData?.pages) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      messages: updater(page.messages),
    })),
  };
};

const prependMessage = <T extends PageData | ConversationPageData>(
  oldData: InfiniteData<T> | undefined,
  newMessage: any,
) => {
  if (!oldData?.pages[0]) return oldData;

  const newPages = [...oldData.pages.map((page) => ({ ...page }))];
  newPages[0]!.messages = [newMessage, ...newPages[0]!.messages];

  return { ...oldData, pages: newPages };
};

interface PageData {
  messages: MessageWithSortedReactions[];
  nextCursor?: string | null;
}

interface ConversationPageData {
  messages: DirectMessageWithSortedReactions[];
  nextCursor?: string | null;
}

type IncomingWebSocketMessage = {
  type: WebSocketMessageType;
  message: MessageWithSortedReactions & {
    conversationId?: string;
    user?: { id: string; image: string };
  };
};

type MessageHandler = (
  message: IncomingWebSocketMessage["message"],
  queryClient: QueryClient,
  handlers: {
    handleConversationNotification: (params: {
      userId: string;
      image: string;
    }) => void;
    handleServerNotification: (params: { serverId: string }) => void;
  },
) => void;

type HandlerMap = {
  [K in WebSocketMessageType]?: MessageHandler;
};

const handleEditMessage: MessageHandler = (message, queryClient) => {
  const queryKey = message.conversationId
    ? ["conversation", message.conversationId]
    : ["messages", message.channelId];

  queryClient.setQueryData(queryKey, (oldMessages: InfiniteData<PageData>) => {
    updateMessageData(oldMessages, (messages) =>
      messages.map((msg) =>
        msg.id === message.id ? { ...msg, content: message.content } : msg,
      ),
    );
  });
};

const handleDeleteMessage: MessageHandler = (message, queryClient) => {
  const queryKey = message.conversationId
    ? ["conversation", message.conversationId]
    : ["messages", message.channelId];

  queryClient.setQueryData(queryKey, (oldMessages: InfiniteData<PageData>) => {
    updateMessageData(oldMessages, (messages) =>
      messages.filter((msg) => msg.id === message.id),
    );
  });
};

const handleCreateMessage: MessageHandler = (
  message,
  queryClient,
  { handleConversationNotification, handleServerNotification },
) => {
  if (message.conversationId) {
    handleConversationNotification({
      userId: message.user!.id,
      image: message.user!.image,
    });

    queryClient.setQueryData(
      ["conversation", message.conversationId],
      (oldMessages: InfiniteData<ConversationPageData>) =>
        prependMessage(oldMessages, message),
    );
  } else {
    handleServerNotification({ serverId: message.serverId });

    queryClient.setQueryData(
      ["messages", message.channelId],
      (oldMessages: InfiniteData<PageData>) =>
        prependMessage(oldMessages, message),
    );
  }
};

const handleUpdateReaction: MessageHandler = (message, queryClient) => {
  const queryKey = message.conversationId
    ? ["conversation", message.conversationId]
    : ["messages", message.channelId];

  queryClient.setQueryData(queryKey, (oldMessages: InfiniteData<any>) =>
    updateMessageData(oldMessages, (messages) =>
      messages.map((msg) => (msg.id === message.id ? message : msg)),
    ),
  );
};

const messageHandlers: HandlerMap = {
  "edit-message-chat": handleEditMessage,
  "edit-message-conversation": handleEditMessage,
  "delete-message-chat": handleDeleteMessage,
  "delete-message-conversation": handleDeleteMessage,
  "create-message-chat": handleCreateMessage,
  "create-message-conversation": handleCreateMessage,
  "create-message-reaction": handleUpdateReaction,
  "create-reaction-conversation": handleUpdateReaction,
};

const SocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const SocketProvider = ({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: string | undefined;
}) => {
  const socket = useRef<EdenWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentServerId, setCurrentServerId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationState>({
    servers: {},
    conversations: {},
  });
  const queryClient = useQueryClient();

  const handleConversationNotification = useCallback(
    ({ userId, image }: { userId: string; image?: string }) => {
      if (userId === currentUserId) return;

      setNotifications((prev) => ({
        ...prev,
        conversations: {
          ...prev.conversations,
          [userId]: {
            count: (prev.conversations[userId]?.count || 0) + 1,
            image,
          },
        },
      }));
    },
    [currentUserId],
  );

  const handleServerNotification = useCallback(
    ({ serverId }: { serverId: string }) => {
      if (serverId === currentServerId) return;

      setNotifications((prev) => ({
        ...prev,
        servers: {
          ...prev.servers,
          [serverId]: {
            hasNotification: true,
          },
        },
      }));
    },
    [],
  );

  useEffect(() => {
    const socketInstance = api.ws.chat.subscribe();
    socket.current = socketInstance;

    socketInstance.on("open", () => {
      setIsConnected(true);
    });

    const handleSocketMessage = (event: { data: IncomingWebSocketMessage }) => {
      const { type, message: newMessage } = event.data;

      queryClient.invalidateQueries({
        queryKey: newMessage.conversationId
          ? ["conversation", newMessage.conversationId]
          : ["messages", newMessage.channelId],
      });

      const handler = messageHandlers[type];

      if (handler) {
        handler(newMessage, queryClient, {
          handleConversationNotification,
          handleServerNotification,
        });
      }
    };

    socketInstance.on("message", (event) => handleSocketMessage(event));

    socketInstance.on("close", () => {
      setIsConnected(false);
    });

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [queryClient, handleConversationNotification, handleServerNotification]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    return !!socket.current?.send(message);
  }, []);

  const leave = useCallback(
    (params: { channelId?: string; serverId?: string }) => {
      return sendMessage({
        type: "leave-chat",
        data: params.channelId
          ? { channelId: params.channelId }
          : { serverId: params.serverId },
      });
    },
    [sendMessage],
  );

  const join = useCallback(
    (params: { channelId?: string; serverId?: string; targetId?: string }) => {
      if (params.targetId) {
        return sendMessage({
          type: "join-conversation",
          data: { targetId: params.targetId },
        });
      }

      return sendMessage({
        type: "join-chat",
        data: params.channelId
          ? { channelId: params.channelId }
          : { serverId: params.serverId },
      });
    },
    [sendMessage],
  );

  const sendChatMessage = useCallback(
    ({ channelId, serverId, content, fileUrl }: ChatMessage) => {
      return sendMessage({
        type: "create-message-chat",
        data: {
          serverId,
          channelId,
          content,
          fileUrl,
        },
      });
    },
    [sendMessage],
  );

  const editChatMessage = useCallback(
    ({ channelId, content, serverId, messageId }: ChatMessage) => {
      return sendMessage({
        type: "edit-message-chat",
        data: {
          serverId,
          channelId,
          content,
          messageId,
        },
      });
    },
    [sendMessage],
  );

  const deleteChatMessage = useCallback(
    ({ serverId, messageId, channelId }: ChatMessage) => {
      return sendMessage({
        type: "delete-message-chat",
        data: {
          channelId,
          serverId,
          messageId,
        },
      });
    },
    [sendMessage],
  );

  const createMessageReaction = useCallback(
    ({ channelId, serverId, messageId, value }: ChatMessage) => {
      return sendMessage({
        type: "create-message-reaction",
        data: {
          channelId,
          serverId,
          messageId,
          value,
        },
      });
    },
    [sendMessage],
  );

  const clearServerNotifications = useCallback((serverId: string) => {
    setNotifications((prev) => ({
      ...prev,
      servers: {
        ...prev.servers,
        [serverId]: { hasNotification: false },
      },
    }));
  }, []);

  const clearConversationNotifications = useCallback((userId: string) => {
    setNotifications((prev) => {
      const updated = { ...prev };
      delete updated.conversations[userId];
      return updated;
    });
  }, []);

  const setCurrentServer = useCallback((serverId: string) => {
    setCurrentServerId(serverId);
  }, []);

  const sendConversationMessage = useCallback(
    ({ targetId, content, fileUrl, conversationId }: ConversationMessage) => {
      return sendMessage({
        type: "create-message-conversation",
        data: {
          targetId,
          content,
          fileUrl,
          conversationId,
        },
      });
    },
    [sendMessage],
  );

  const editConversationMessage = useCallback(
    ({ content, messageId }: ConversationMessage) => {
      return sendMessage({
        type: "edit-message-conversation",
        data: {
          content,
          messageId,
        },
      });
    },
    [sendMessage],
  );

  const deleteConversationMessage = useCallback(
    ({ messageId }: ConversationMessage) => {
      return sendMessage({
        type: "delete-message-conversation",
        data: {
          messageId,
        },
      });
    },
    [sendMessage],
  );

  const createDirectMessageReaction = useCallback(
    ({ conversationId, messageId, value }: ConversationMessage) => {
      return sendMessage({
        type: "create-reaction-conversation",
        data: {
          conversationId,
          messageId,
          value,
        },
      });
    },
    [sendMessage],
  );

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    leave,
    join,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
    createMessageReaction,
    notifications,
    clearServerNotifications,
    currentServerId,
    setCurrentServer,
    sendConversationMessage,
    editConversationMessage,
    deleteConversationMessage,
    createDirectMessageReaction,
    clearConversationNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): WebSocketContextType => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
