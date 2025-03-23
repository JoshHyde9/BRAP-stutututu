import { useEffect } from "react";
import { useSocket } from "@/providers/ws-provider";
import { useMutation } from "@tanstack/react-query";

type ConversationsProps = {
  targetId?: string;
};

type ConversationMessage = {
  targetId?: string;
  content?: string;
  fileUrl?: string;
  conversationId?: string;
  messageId?: string;
};

export const useConversations = ({ targetId }: ConversationsProps) => {
  const {
    isConnected,
    joinConversation,
    sendConversationMessage,
    editConversationMessage,
    deleteConversationMessage,
  } = useSocket();

  useEffect(() => {
    if (targetId && isConnected) {
      joinConversation(targetId);
    }
  }, [targetId, isConnected]);

  const sendMessage = useMutation({
    mutationFn: async ({
      content,
      fileUrl,
      targetId,
      conversationId,
    }: ConversationMessage) => {
      try {
        sendConversationMessage({ targetId, content, fileUrl, conversationId });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
  });

  const editMessage = useMutation({
    mutationFn: async ({ content, messageId }: ConversationMessage) => {
      try {
        editConversationMessage({ content, messageId });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async ({ messageId }: ConversationMessage) => {
      try {
        deleteConversationMessage({ messageId });

        return { success: true };
      } catch (error) {
        throw error;
      }
    },
  });

  return { sendMessage, editMessage, deleteMessage };
};
