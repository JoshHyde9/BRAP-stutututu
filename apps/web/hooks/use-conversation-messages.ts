import { useEffect, useMemo } from "react";
import { useSocket } from "@/providers/ws-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { api, type DirectMessageWithSortedReactions } from "@workspace/api";

type GroupedMessages = {
  [dateKey: string]: DirectMessageWithSortedReactions[];
};

type ConversationMessagesProps = {
  conversationId: string;
  targetId: string;
};

export const useConversationMessages = ({
  conversationId,
  targetId,
}: ConversationMessagesProps) => {
  const {
    isConnected,
    actions: { join },
  } = useSocket();

  useEffect(() => {
    if (targetId && isConnected) {
      join({ targetId });
    }
  }, [targetId, isConnected, join]);

  const query = useInfiniteQuery({
    queryKey: ["conversation", conversationId],
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    queryFn: async ({
      pageParam = undefined,
    }: {
      pageParam: string | undefined;
    }) => {
      const { data, error } = await api.conversation.messages.get({
        query: {
          conversationId,
          cursor: pageParam,
        },
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

      groups[dateKey].unshift(message);

      return groups;
    }, {});
  }, [query.data]);

  return { ...query, groupedMessages };
};
