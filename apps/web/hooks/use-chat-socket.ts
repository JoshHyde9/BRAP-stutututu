import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

interface SendMessageParams {
  serverId: string;
  channelId: string;
  content: string;
  fileUrl?: string;
  messageId?: string;
}

export const useChatSocket = () => {
  const {
    sendChatMessage,
  } = useSocket();

  const sendMessage = useMutation({
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
  });

  return { sendMessage };
};
