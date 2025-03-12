import { useSocket } from "@/app/providers/ws-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SendMessageParams {
  serverId: string;
  channelId: string;
  content: string;
  fileUrl?: string;
}

export const useChatSocket = () => {
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      channelId,
      serverId,
      fileUrl,
      content,
    }: SendMessageParams) => {
      if (!socket || !connected) {
        throw new Error("No WS connection");
      }

      return new Promise((resolve, reject) => {
        try {
          socket.send({
            type: "create-chat-message",
            data: {
              channelId,
              serverId,
              content,
              fileUrl,
            },
          });

          resolve({ success: true });
        } catch (error) {
          reject(error);
        }
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
  });
};
