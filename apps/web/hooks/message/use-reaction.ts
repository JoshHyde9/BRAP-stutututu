import type { QueryParamsKeys } from "@/lib/types";

import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

type MessageReactionParams = {
  queryParams: QueryParamsKeys;
  messageId: string;
  value: string;
};

export const useReactions = () => {
  const {
    actions: { sendMessage },
  } = useSocket();
  return useMutation({
    mutationFn: async (params: MessageReactionParams) => {
      try {
        const {
          messageId,
          value,
          queryParams: { channelId, serverId, conversationId },
        } = params;

        if (conversationId) {
          sendMessage({
            type: "create-reaction-conversation",
            data: {
              conversationId,
              messageId,
              value,
            },
          });
        }

        if (channelId && serverId) {
          sendMessage({
            type: "create-message-reaction",
            data: {
              channelId,
              serverId,
              messageId,
              value,
            },
          });
        }

        if (!conversationId && !(channelId && serverId)) {
          throw new Error("Insufficient params");
        }

        return { success: true };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });
};
