"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";

import {
  api,
  DirectMessageWithSortedReactions,
  DirectMessageWithUser,
  MessageWithSortedReactions,
} from "@workspace/api";

type ChatMessage = {
  channelId?: string;
  serverId?: string;
  content?: string;
  fileUrl?: string;
  messageId?: string;
  value?: string;
};

type ConversationMessage = {
  targetId?: string;
  content?: string;
  fileUrl?: string;
  conversationId?: string;
  messageId?: string;
  value?: string;
};

type WebSocketMessageType =
  | "join"
  | "leave"
  | "create-chat-message"
  | "edit-chat-message"
  | "delete-chat-message"
  | "create-message-reaction"
  | "create-conversation-message"
  | "conversation-join"
  | "edit-conversation-message"
  | "delete-conversation-message"
  | "create-direct-message-reaction";

export type WebSocketMessage = {
  type: WebSocketMessageType;
  data: ChatMessage | ConversationMessage;
};

interface ServerNotification {
  hasNotification: boolean;
}

type NotificationState = {
  [serverId: string]: ServerNotification;
};

type WebSocketContextType = {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => boolean;
  joinChannel: (channelId: string) => boolean;
  leaveChannel: (channelId: string) => boolean;
  sendChatMessage: (data: ChatMessage) => boolean;
  editChatMessage: (data: ChatMessage) => boolean;
  deleteChatMessage: (data: ChatMessage) => boolean;
  createMessageReaction: (data: ChatMessage) => boolean;
  joinServer: (serverId: string) => boolean;
  leaveServer: (serverId: string) => boolean;
  notifications: NotificationState;
  clearServerNotifications: (serverId: string) => void;
  sendConversationMessage: (data: ConversationMessage) => void;
  joinConversation: (targetId: string) => boolean;
  editConversationMessage: (data: ConversationMessage) => void;
  deleteConversationMessage: (data: ConversationMessage) => void;
  createDirectMessageReaction: (data: ConversationMessage) => void;
};

type EdenWebSocket = ReturnType<typeof api.ws.chat.subscribe>;

interface PageData {
  messages: MessageWithSortedReactions[];
  nextCursor?: string | null;
}

interface ConversationPageData {
  messages: DirectMessageWithSortedReactions[];
  nextCursor?: string | null;
}

type MessageData = {
  type: WebSocketMessageType;
  message: MessageWithSortedReactions;
};

const SocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<EdenWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationState>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const socketInstance = api.ws.chat.subscribe();
    socket.current = socketInstance;

    socketInstance.on("open", () => {
      setIsConnected(true);
    });

    socketInstance.on("message", (event) => {
      // @ts-ignore
      // FIXME: try work out a way to type the data object????
      const eventData: MessageData = event.data;
      const newMessage: MessageWithSortedReactions = eventData.message;

      queryClient.invalidateQueries({
        queryKey: ["messages", newMessage.channelId],
      });

      switch (eventData.type) {
        case "edit-chat-message":
          // Only update message content instead of pushing entire new message
          queryClient.setQueryData(
            ["messages", newMessage.channelId],
            (oldMessages: InfiniteData<PageData>) => {
              if (!oldMessages?.pages) return oldMessages;

              const newPages = oldMessages.pages.map((page) => ({
                ...page,
                messages: page.messages.map((message) =>
                  message.id === newMessage.id
                    ? { ...message, content: newMessage.content }
                    : message,
                ),
              }));

              return { ...oldMessages, pages: newPages };
            },
          );
          break;
        case "delete-chat-message":
          // Delete the existing message instead of pushing it to the queue
          queryClient.setQueryData(
            ["messages", newMessage.channelId],
            (oldMessages: InfiniteData<PageData>) => {
              if (!oldMessages?.pages) return oldMessages;

              const newPages = oldMessages.pages.map((page) => ({
                ...page,
                messages: page.messages.filter((message) => {
                  return message.id !== newMessage.id;
                }),
              }));

              return { ...oldMessages, pages: newPages };
            },
          );
          break;
        case "create-message-reaction":
          // Update existing message instead of adding new one
          queryClient.setQueryData(
            ["messages", newMessage.channelId],
            (oldMessages: InfiniteData<PageData>) => {
              if (!oldMessages?.pages) return oldMessages;

              const newPages = oldMessages.pages.map((page) => ({
                ...page,
                messages: page.messages.map((message) =>
                  message.id === newMessage.id ? newMessage : message,
                ),
              }));

              return { ...oldMessages, pages: newPages };
            },
          );
          break;
        case "create-conversation-message":
          queryClient.setQueryData(
            ["conversation", newMessage.conversationId],
            (oldMessages: InfiniteData<ConversationPageData>) => {
              if (!oldMessages || !oldMessages.pages[0]) return oldMessages;

              const newData = {
                ...oldMessages,
                pages: [...oldMessages.pages.map((page) => ({ ...page }))],
              };

              if (newData && newData.pages[0]?.messages) {
                newData.pages[0].messages = [
                  newMessage,
                  ...oldMessages.pages[0].messages,
                ];
              } else {
                newData.pages[0]!.messages = [newMessage];
              }

              return newData;
            },
          );
          break;
        case "edit-conversation-message":
          // Only update message content instead of pushing entire new message
          queryClient.setQueryData(
            ["conversation", newMessage.conversationId],
            (oldMessages: InfiniteData<ConversationPageData>) => {
              if (!oldMessages?.pages) return oldMessages;

              const newPages = oldMessages.pages.map((page) => ({
                ...page,
                messages: page.messages.map((message) =>
                  message.id === newMessage.id
                    ? { ...message, content: newMessage.content }
                    : message,
                ),
              }));

              return { ...oldMessages, pages: newPages };
            },
          );
          break;
        case "delete-conversation-message":
          // Delete the existing message instead of pushing it to the queue
          queryClient.setQueryData(
            ["conversation", newMessage.conversationId],
            (oldMessages: InfiniteData<ConversationPageData>) => {
              if (!oldMessages?.pages) return oldMessages;

              const newPages = oldMessages.pages.map((page) => ({
                ...page,
                messages: page.messages.filter((message) => {
                  return message.id !== newMessage.id;
                }),
              }));

              return { ...oldMessages, pages: newPages };
            },
          );
          break;
        case "create-direct-message-reaction":
          // Update existing message instead of adding new one
          queryClient.setQueryData(
            ["conversation", newMessage.conversationId],
            (oldMessages: InfiniteData<ConversationPageData>) => {
              if (!oldMessages?.pages) return oldMessages;

              const newPages = oldMessages.pages.map((page) => ({
                ...page,
                messages: page.messages.map((message) =>
                  message.id === newMessage.id ? newMessage : message,
                ),
              }));

              return { ...oldMessages, pages: newPages };
            },
          );
          break;
        default:
          setNotifications((prev) => ({
            ...prev,
            [newMessage.serverId]: {
              hasNotification: true,
            },
          }));

          queryClient.setQueryData(
            ["messages", newMessage.channelId],
            (oldMessages: InfiniteData<PageData>) => {
              if (!oldMessages || !oldMessages.pages[0]) return oldMessages;

              const newData = {
                ...oldMessages,
                pages: [...oldMessages.pages.map((page) => ({ ...page }))],
              };

              if (newData && newData.pages[0]?.messages) {
                newData.pages[0].messages = [
                  newMessage,
                  ...oldMessages.pages[0].messages,
                ];
              } else {
                newData.pages[0]!.messages = [newMessage];
              }

              return newData;
            },
          );
          break;
      }
    });

    socketInstance.on("close", () => {
      setIsConnected(false);
    });

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [queryClient]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket.current) {
      socket.current.send(message);
      return true;
    }

    return false;
  }, []);

  const joinChannel = useCallback(
    (channelId: string) => {
      return sendMessage({
        type: "join",
        data: { channelId },
      });
    },
    [sendMessage],
  );

  const joinServer = useCallback(
    (serverId: string) => {
      return sendMessage({
        type: "join",
        data: { serverId },
      });
    },
    [sendMessage],
  );

  const leaveChannel = useCallback(
    (channelId: string) => {
      return sendMessage({
        type: "leave",
        data: { channelId },
      });
    },
    [sendMessage],
  );

  const leaveServer = useCallback(
    (serverId: string) => {
      return sendMessage({
        type: "leave",
        data: { serverId },
      });
    },
    [sendMessage],
  );

  const sendChatMessage = useCallback(
    ({ channelId, serverId, content, fileUrl }: ChatMessage) => {
      return sendMessage({
        type: "create-chat-message",
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
        type: "edit-chat-message",
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
        type: "delete-chat-message",
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

  const clearServerNotifications = (serverId: string) => {
    setNotifications((prev) => ({
      ...prev,
      [serverId]: {
        ...prev[serverId],
        hasNotification: false,
      },
    }));
  };

  const joinConversation = useCallback(
    (targetId: string) => {
      return sendMessage({
        type: "conversation-join",
        data: { targetId },
      });
    },
    [sendMessage],
  );

  const sendConversationMessage = useCallback(
    ({ targetId, content, fileUrl, conversationId }: ConversationMessage) => {
      return sendMessage({
        type: "create-conversation-message",
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
        type: "edit-conversation-message",
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
        type: "delete-conversation-message",
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
        type: "create-direct-message-reaction",
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
    joinChannel,
    leaveChannel,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
    createMessageReaction,
    joinServer,
    leaveServer,
    notifications,
    clearServerNotifications,
    sendConversationMessage,
    joinConversation,
    editConversationMessage,
    deleteConversationMessage,
    createDirectMessageReaction,
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
