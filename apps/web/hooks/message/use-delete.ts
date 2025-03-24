import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

import { QueryParamsKeys } from "@/lib/types";

type DeleteMessageParams = {
  queryParams?: Pick<QueryParamsKeys, "channelId" | "serverId">;
  messageId: string;
};

export const useDeleteMessage = () => {
  const { deleteChatMessage, deleteConversationMessage } = useSocket();

  return useMutation({
    mutationFn: async (params: DeleteMessageParams) => {
      try {
        const { messageId, queryParams } = params;

        if (!queryParams) {
          deleteConversationMessage({ messageId });
        } else {
          deleteChatMessage({
            messageId,
            channelId: queryParams.channelId,
            serverId: queryParams.serverId,
          });
        }

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
  });
};
