import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@workspace/api";

import { useSocket } from "@/app/providers/ws-provider";

type ChannelMessagesProps = {
  channelId: string;
};

export const useChannelMessages = ({ channelId }: ChannelMessagesProps) => {
  const { isConnected , joinChannel, leaveChannel } = useSocket();
  const queryClient = useQueryClient();

    useEffect(() => {
      if (isConnected && channelId) {
        joinChannel(channelId);
      }
  
      return () => {
        if (isConnected && channelId) {
          leaveChannel(channelId);
        }
      };
    }, [isConnected, channelId, joinChannel, leaveChannel]);

  return useQuery({
    queryKey: ["messages", channelId],
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
