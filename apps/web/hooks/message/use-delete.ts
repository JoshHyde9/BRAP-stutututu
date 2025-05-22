import type { QueryParamsKeys } from "@/lib/types";

import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

type DeleteMessageParams = {
  queryParams?: Pick<QueryParamsKeys, "channelId" | "serverId">;
  messageId: string;
};

export const useDeleteMessage = () => {
  const {
    actions: { sendMessage },
  } = useSocket();

  return useMutation({
    mutationFn: async (params: DeleteMessageParams) => {
      try {
        const { messageId, queryParams } = params;

        if (!queryParams) {
          sendMessage({
            type: "delete-message-conversation",
            data: { messageId },
          });
        } else {
          sendMessage({
            type: "delete-message-chat",
            data: {
              messageId,
              channelId: queryParams.channelId,
              serverId: queryParams.serverId,
            },
          });
        }

        return { success: true };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });
};
