import { useSocket } from "@/providers/ws-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    editChatMessage,
    deleteChatMessage,
    createMessageReaction,
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

  const deleteMessage = useMutation({
    mutationFn: async ({
      channelId,
      serverId,
      messageId,
    }: {
      channelId: string;
      serverId: string;
      messageId: string;
    }) => {
      return new Promise((resolve, reject) => {
        try {
          deleteChatMessage({ channelId, serverId, messageId });

          resolve({ success: true });
        } catch (error) {
          reject(error);
        }
      });
    },
  });

  const messageReaction = useMutation({
    mutationFn: async ({
      channelId,
      value,
      serverId,
      messageId,
    }: {
      channelId: string;
      value: string;
      serverId: string;
      messageId: string;
    }) => {
      try {
        createMessageReaction({ channelId, serverId, messageId, value });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
  });

  return { sendMessage, editMessage, deleteMessage, messageReaction };
};
