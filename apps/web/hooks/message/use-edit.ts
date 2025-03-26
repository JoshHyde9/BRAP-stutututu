import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

import { QueryParamsKeys } from "@/lib/types";

type EditMessageParams = {
  queryParams?: Pick<QueryParamsKeys, "channelId" | "serverId">;
  messageId: string;
  content: string;
};

export const useEditMessage = () => {
  const {
    actions: { sendMessage },
  } = useSocket();
  return useMutation({
    mutationFn: async (params: EditMessageParams) => {
      const { messageId, content, queryParams } = params;

      try {
        if (queryParams?.channelId && queryParams?.serverId) {
          sendMessage({
            type: "edit-message-chat",
            data: {
              content,
              messageId,
              channelId: queryParams.channelId,
              serverId: queryParams.serverId,
            },
          });
        } else {
          sendMessage({
            type: "edit-message-conversation",
            data: { content, messageId },
          });
        }

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
  });
};
