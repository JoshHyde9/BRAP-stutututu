import type { QueryParamsKeys } from "@/lib/types";

import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

type SendMessageParams<T extends QueryParamsKeys> = {
  queryParams: T;
  targetId?: T extends { conversationId: string } ? string : string | undefined;
  content: string;
  fileUrl?: string;
};

export const useSendMessage = () => {
  const {
    actions: { sendMessage },
  } = useSocket();

  return useMutation({
    mutationFn: async (params: SendMessageParams<QueryParamsKeys>) => {
      const { content, targetId, fileUrl, queryParams } = params;

      if (targetId) {
        sendMessage({
          type: "create-message-conversation",
          data: {
            targetId,
            content,
            fileUrl,
            conversationId: queryParams.conversationId,
          },
        });
      } else {
        sendMessage({
          type: "create-message-chat",
          data: {
            channelId: queryParams.channelId,
            serverId: queryParams.serverId,
            content,
            fileUrl,
          },
        });
      }

      return { success: true };
    },
  });
};
