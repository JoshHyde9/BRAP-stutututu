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
};

export type WebSocketMessage = {
  type: "join" | "leave" | "create-chat-message";
  data: ChatMessage;
};

type WebSocketContextType = {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => boolean;
  joinChannel: (channelId: string) => boolean;
  leaveChannel: (channelId: string) => boolean;
  sendChatMessage: (data: ChatMessage) => boolean;
};

type EdenWebSocket = ReturnType<typeof api.ws.chat.subscribe>;

interface PageData {
  messages: WSMessageType[];
  nextCursor?: string | null;
}

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
      const newMessage: WSMessageType = event.data.message;

      if (newMessage) {
        queryClient.invalidateQueries({
          queryKey: ["messages", newMessage.channelId],
        });

        // FIXME: This seems gross
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

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    joinChannel,
    leaveChannel,
    sendChatMessage,
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
