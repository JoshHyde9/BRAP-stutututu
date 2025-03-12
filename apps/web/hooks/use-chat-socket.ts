import { useSocket } from "@/app/providers/ws-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SendMessageParams {
  serverId: string;
  channelId: string;
  content: string;
  fileUrl?: string;
}

export const useChatSocket = () => {
  const { sendChatMessage } = useSocket();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      channelId,
      serverId,
      fileUrl,
      content,
    }: SendMessageParams) => {
      return new Promise((resolve, reject) => {
        try {
          sendChatMessage({ channelId, serverId, content, fileUrl });

          resolve({ success: true });
        } catch (error) {
          reject(error);
        }
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.channelId],
      });
    },
  });
};
