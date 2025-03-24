import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

import { QueryParamsKeys } from "@/lib/types";

type MessageReactionParams = {
  queryParams: QueryParamsKeys;
  messageId: string;
  value: string;
};

export const useReactions = () => {
  const { createMessageReaction, createDirectMessageReaction } = useSocket();
  return useMutation({
    mutationFn: async (params: MessageReactionParams) => {
      try {
        const {
          messageId,
          value,
          queryParams: { channelId, serverId, conversationId },
        } = params;

        if (conversationId) {
          createDirectMessageReaction({
            conversationId,
            messageId,
            value,
          });
        }

        if (channelId && serverId) {
          createMessageReaction({
            channelId,
            serverId,
            messageId,
            value,
          });
        }

        if (!conversationId && !(channelId && serverId)) {
          throw new Error("Insufficient params");
        }

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
  });
};
