import { useEffect } from "react";
import { useSocket } from "@/app/providers/ws-provider";
import { useInfiniteQuery } from "@tanstack/react-query";

import { api } from "@workspace/api";

type ChannelMessagesProps = {
  channelId: string;
};

export const useChannelMessages = ({ channelId }: ChannelMessagesProps) => {
  const { isConnected, joinChannel, leaveChannel } = useSocket();

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

  return useInfiniteQuery({
    queryKey: ["messages", channelId],
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    queryFn: async ({
      pageParam = undefined,
    }: {
      pageParam: string | undefined;
    }) => {
      const { data, error } = await api.message.channelMessages.get({
        query: { channelId: channelId, cursor: pageParam },
      });

      if (error) {
        Promise.reject(new Error(error.value.message));
      }

      return data;
    },
    initialPageParam: "",
  });
};
