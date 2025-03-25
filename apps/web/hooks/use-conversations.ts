import { useEffect } from "react";
import { useSocket } from "@/providers/ws-provider";

type ConversationsProps = {
  targetId?: string;
};

export const useConversations = ({ targetId }: ConversationsProps) => {
  const { isConnected, joinConversation } = useSocket();

  useEffect(() => {
    if (targetId && isConnected) {
      joinConversation(targetId);
    }
  }, [targetId, isConnected]);
};
