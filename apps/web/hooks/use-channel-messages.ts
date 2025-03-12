import { useEffect } from "react";
import { useSocket } from "@/app/providers/ws-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@workspace/api";

import { WSMessageType } from "@/lib/types";

type ChannelMessagesProps = {
  channelId: string;
};

export const useChannelMessages = ({ channelId }: ChannelMessagesProps) => {
  const queryClient = useQueryClient();
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (socket && connected) {
      socket.on("message", (data) => {
        const newMessage: WSMessageType = data.data.message;

        if (newMessage) {
          queryClient.setQueryData(
            ["messages"],
            (oldData: WSMessageType[] = []) => {
              return [...oldData, newMessage];
            },
          );
        }
      });
    }
  }, [socket, connected, queryClient]);

  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await api.message
        .channelMessages({ channelId })
        .get();

      if (error) {
        Promise.reject(new Error(error.value.message));
      }

      return data;
    },
    initialData: () => queryClient.getQueryData(["messages"]),
  });
};
