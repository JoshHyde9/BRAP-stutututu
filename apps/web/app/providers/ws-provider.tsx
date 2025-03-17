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

import { api } from "@workspace/api";

import { WSMessageType } from "@/lib/types";

type ChatMessage = {
  channelId: string;
  serverId?: string;
  content?: string;
  fileUrl?: string;
  messageId?: string;
};

type WebSocketMessageType =
  | "join"
  | "leave"
  | "create-chat-message"
  | "edit-chat-message"
  | "delete-chat-message";

export type WebSocketMessage = {
  type: WebSocketMessageType;
  data: ChatMessage;
};

type WebSocketContextType = {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => boolean;
  joinChannel: (channelId: string) => boolean;
  leaveChannel: (channelId: string) => boolean;
  sendChatMessage: (data: ChatMessage) => boolean;
  editChatMessage: (data: ChatMessage) => boolean;
  deleteChatMessage: (data: ChatMessage) => boolean;
};

type EdenWebSocket = ReturnType<typeof api.ws.chat.subscribe>;

interface PageData {
  messages: WSMessageType[];
  nextCursor?: string | null;
}

type MessageData = {
  type: WebSocketMessageType;
  message: WSMessageType;
};

const SocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<EdenWebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
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
      const newMessage: WSMessageType = eventData.message;

      queryClient.invalidateQueries({
        queryKey: ["messages", newMessage.channelId],
      });

      switch (eventData.type) {
        case "edit-chat-message":
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
        case "delete-chat-message":
          // Delete the existing message instead of pushing it to the queue
          queryClient.setQueryData(
            ["messages", newMessage.channelId],
            (oldMessages: InfiniteData<PageData>) => {
              if (!oldMessages?.pages) return oldMessages;

              const newPages = oldMessages.pages.map((page) => ({
                ...page,
                messages: page.messages.filter((message) => {
                  console.log(message);
                  return message.id !== newMessage.id;
                }),
              }));

              return { ...oldMessages, pages: newPages };
            },
          );
          break;
        default:
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

  const leaveChannel = useCallback(
    (channelId: string) => {
      return sendMessage({
        type: "leave",
        data: { channelId },
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

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    joinChannel,
    leaveChannel,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
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
