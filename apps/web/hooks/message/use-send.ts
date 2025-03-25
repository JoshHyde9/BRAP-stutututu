import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

import { QueryParamsKeys } from "@/lib/types";

type SendMessageParams<T extends QueryParamsKeys> = {
  queryParams: T;
  targetId?: T extends { conversationId: string } ? string : string | undefined;
  content: string;
  fileUrl?: string;
};

export const useSendMessage = () => {
  const { sendChatMessage, sendConversationMessage } = useSocket();

  return useMutation({
    mutationFn: async (params: SendMessageParams<QueryParamsKeys>) => {
      const { content, targetId, fileUrl, queryParams } = params;

      console.log(targetId);

      if (targetId) {
        sendConversationMessage({
          targetId,
          content,
          fileUrl,
          conversationId: queryParams.conversationId,
        });
      } else {
        sendChatMessage({
          channelId: queryParams.channelId,
          serverId: queryParams.serverId,
          content,
          fileUrl,
        });
      }

      return { success: true };
    },
  });
};
