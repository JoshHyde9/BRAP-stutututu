import { useSocket } from "@/app/providers/ws-provider";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { WSMessageType } from "@/lib/types";

interface SendMessageParams {
  serverId: string;
  channelId: string;
  content: string;
  fileUrl?: string;
  messageId?: string;
}

interface PageData {
  messages: WSMessageType[];
  nextCursor?: string | null;
}

export const useChatSocket = () => {
  const { sendChatMessage, editChatMessage } = useSocket();

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

  const editMessage = useMutation({
    mutationFn: async ({
      channelId,
      serverId,
      content,
      messageId,
    }: SendMessageParams) => {
      return new Promise((resolve, reject) => {
        try {
          editChatMessage({ channelId, serverId, content, messageId });

          resolve({ success: true });
        } catch (error) {
          reject(error);
        }
      });
    },
  });

  return { sendMessage, editMessage };
};
