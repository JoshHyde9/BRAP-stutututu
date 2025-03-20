import type { MessageWithSortedReactions } from "@workspace/api";

import { useEffect, useMemo } from "react";
import { useSocket } from "@/providers/ws-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { api } from "@workspace/api";

interface GroupedMessages {
  [dateKey: string]: MessageWithSortedReactions[];
}

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

  const query = useInfiniteQuery({
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

  const groupedMessages = useMemo<GroupedMessages>(() => {
    if (!query.data) return {};

    const allMessages = query.data.pages.flatMap((page) => page?.messages!);

    return allMessages.reduce<GroupedMessages>((groups, message) => {
      const dateKey = format(new Date(message.createdAt), "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);

      return groups;
    }, {});
  }, [query.data]);

  return { ...query, groupedMessages };
};
