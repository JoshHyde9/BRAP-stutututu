"use client";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { DirectMessageWithSortedReactions, MessageWithSortedReactions } from "@workspace/api";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "@workspace/api";

type MessageBase = {
  messageId?: string;
  content?: string;
  fileUrl?: string;
  value?: string;
};

type ChatMessage = MessageBase & {
  serverId?: string;
  channelId?: string;
};

type ConversationMessage = MessageBase & {
  conversationId?: string;
  targetId?: string;
  user?: {
    id: string;
    image: string;
    name: string;
  };
};

type MessageTypeMap = {
  "join-chat": { channelId?: string; serverId?: string };
  "leave-chat": { channelId?: string; serverId?: string };
  "create-message-chat": ChatMessage;
  "edit-message-chat": ChatMessage;
  "delete-message-chat": ChatMessage;
  "create-message-reaction": ChatMessage;
  "join-conversation": { targetId: string };
  "create-message-conversation": ConversationMessage;
  "edit-message-conversation": ConversationMessage;
  "delete-message-conversation": ConversationMessage;
  "create-reaction-conversation": ConversationMessage;
};

type WebSocketMessageType = keyof MessageTypeMap;

type WebSocketMessage<T extends WebSocketMessageType> = {
  type: T;
  data: MessageTypeMap[T];
};

type NotificationState = {
  servers: Record<string, { hasNotification: boolean }>;
  conversations: Record<string, { count: number; image?: string; name: string }>;
};

type WebSocketContextType = {
  isConnected: boolean;
  actions: {
    sendMessage: <T extends WebSocketMessageType>({
      type,
      data,
    }: {
      type: T;
      data: MessageTypeMap[T];
    }) => boolean;
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
    clearServerNotifications: (serverId: string) => void;
    setCurrentServer: (serverId: string) => void;
    clearConversationNotifications: (targetId: string) => void;
  };
  notifications: NotificationState;
  currentServerId: string | null;
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
  // biome-ignore lint: any is fair enough here
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
    user?: { id: string; image: string; name: string };
  };
};

type MessageHandler = (
  message: IncomingWebSocketMessage["message"],
  queryClient: QueryClient,
  handlers: {
    handleConversationNotification: (params: {
      userId: string;
      image: string;
      name: string;
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
      messages.map((msg) => (msg.id === message.id ? { ...msg, content: message.content } : msg)),
    );
  });
};

const handleDeleteMessage: MessageHandler = (message, queryClient) => {
  const queryKey = message.conversationId
    ? ["conversation", message.conversationId]
    : ["messages", message.channelId];

  queryClient.setQueryData(queryKey, (oldMessages: InfiniteData<PageData>) => {
    updateMessageData(oldMessages, (messages) => messages.filter((msg) => msg.id === message.id));
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
      name: message.user!.name,
    });

    queryClient.setQueryData(
      ["conversation", message.conversationId],
      (oldMessages: InfiniteData<ConversationPageData>) => prependMessage(oldMessages, message),
    );
  } else {
    handleServerNotification({ serverId: message.serverId });

    queryClient.setQueryData(
      ["messages", message.channelId],
      (oldMessages: InfiniteData<PageData>) => prependMessage(oldMessages, message),
    );
  }
};

const handleUpdateReaction: MessageHandler = (message, queryClient) => {
  const queryKey = message.conversationId
    ? ["conversation", message.conversationId]
    : ["messages", message.channelId];

  queryClient.setQueryData(queryKey, (oldMessages: InfiniteData<PageData>) =>
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

const SocketContext = createContext<WebSocketContextType | undefined>(undefined);

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
  const currentServerIdRef = useRef<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationState>({
    servers: {},
    conversations: {},
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    currentServerIdRef.current = currentServerId;
  }, [currentServerId]);

  const handleConversationNotification = useCallback(
    ({
      userId,
      image,
      name,
    }: {
      userId: string;
      image?: string;
      name: string;
    }) => {
      if (userId === currentUserId) return;

      setNotifications((prev) => ({
        ...prev,
        conversations: {
          ...prev.conversations,
          [userId]: {
            count: (prev.conversations[userId]?.count || 0) + 1,
            image,
            name,
          },
        },
      }));
    },
    [currentUserId],
  );

  const handleServerNotification = useCallback(({ serverId }: { serverId: string }) => {
    if (serverId === currentServerIdRef.current) return;

    setNotifications((prev) => ({
      ...prev,
      servers: {
        ...prev.servers,
        [serverId]: {
          hasNotification: true,
        },
      },
    }));
  }, []);

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

    // @ts-ignore I will never be able to fix this
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

  const sendMessage = useMemo(
    () =>
      <T extends WebSocketMessageType>({
        type,
        data,
      }: {
        type: T;
        data: MessageTypeMap[T];
      }): boolean => {
        if (!socket.current) return false;

        const message: WebSocketMessage<T> = { type, data };
        socket.current.send(message);
        return true;
      },
    [],
  );
  const leave = useCallback(
    (params: { channelId?: string; serverId?: string }) => {
      return sendMessage({
        type: "leave-chat",
        data: params.channelId ? { channelId: params.channelId } : { serverId: params.serverId },
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
        data: params.channelId ? { channelId: params.channelId } : { serverId: params.serverId },
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

  const value = useMemo<WebSocketContextType>(
    () => ({
      isConnected,
      actions: {
        join,
        leave,
        sendMessage,
        clearServerNotifications,
        setCurrentServer,
        clearConversationNotifications,
      },
      notifications,
      currentServerId,
    }),
    [
      isConnected,
      join,
      leave,
      sendMessage,
      clearServerNotifications,
      setCurrentServer,
      clearConversationNotifications,
      notifications,
      currentServerId,
    ],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): WebSocketContextType => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
