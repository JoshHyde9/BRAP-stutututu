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

interface ServerNotification {
  hasNotification: boolean;
}

type NotificationState = {
  [serverId: string]: ServerNotification;
};

type ConversationNotification = {
  [userId: string]: {
    image: string;
    count: number;
  };
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
  conversationNotifications: ConversationNotification;
  clearConversationNotifications: (targetId: string) => void;
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
  message: MessageWithSortedReactions & { conversationId?: string };
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
  const [notifications, setNotifications] = useState<NotificationState>({});
  const [conversationNotifications, setConversationNotifications] =
    useState<ConversationNotification>({});
  const [currentServerId, setCurrentServerId] = useState<string | null>(null);
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
      const newMessage = eventData.message;

      queryClient.invalidateQueries({
        queryKey: ["messages", newMessage.channelId],
      });

      switch (eventData.type) {
        case "edit-message-chat":
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
        case "delete-message-chat":
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
        case "create-message-conversation":
          setConversationNotifications((prev) => {
            if (newMessage.userId !== currentUserId) {
              if (!prev[newMessage.userId]) {
                return {
                  ...prev,
                  [newMessage.userId]: {
                    image: newMessage.user.image,
                    count: 1,
                  },
                };
              }
              return {
                ...prev,
                [newMessage.userId]: {
                  ...prev[newMessage.userId],
                  count: (prev[newMessage.userId]?.count || 0) + 1,
                },
              };
            }

            return prev;
          });

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
                  // @ts-ignore
                  newMessage,
                  ...oldMessages.pages[0].messages,
                ];
              } else {
                // @ts-ignore
                newData.pages[0]!.messages = [newMessage];
              }

              return newData;
            },
          );
          break;
        case "edit-message-conversation":
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
        case "delete-message-conversation":
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
        case "create-reaction-conversation":
          console.log("I AM HERE")
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
          setNotifications((prev) => {
            if (newMessage.serverId === currentServerId) {
              return prev;
            }

            return {
              ...prev,
              [newMessage.serverId]: {
                hasNotification: true,
              },
            };
          });

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

  const clearServerNotifications = (serverId: string) => {
    setNotifications((prev) => {
      const updated = { ...prev };
      if (updated[serverId]) {
        updated[serverId] = {
          hasNotification: false,
        };
      }
      return updated;
    });
  };

  const clearConversationNotifications = (targetId: string) => {
    setConversationNotifications((prev) => {
      const updatedNotifications = { ...prev };
      delete updatedNotifications[targetId];
      return updatedNotifications;
    });
  };

  const setCurrentServer = (serverId: string) => {
    setCurrentServerId(serverId);
  };

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
    conversationNotifications,
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
