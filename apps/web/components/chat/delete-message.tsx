import { Trash } from "lucide-react";

import { useChatSocket } from "@/hooks/use-chat-socket";

import { ActionTooltip } from "@/components/action-tooltip";

type DeleteConversationMessage = {
  conversationId: string;
  messageId: string;
  channelId?: never;
  serverId?: never;
}

type DeleteChannelMessage = {
  channelId: string;
  messageId: string;
  serverId: string;
  conversationId?: never;
};

type DeleteMessageProps = DeleteChannelMessage | DeleteConversationMessage;

export const DeleteMessage: React.FC<DeleteMessageProps> = ({
  channelId,
  messageId,
  serverId,
}) => {
  const { deleteMessage } = useChatSocket();

  return (
    <ActionTooltip label="Delete">
      <Trash
        onClick={() =>
          deleteMessage.mutate({
            channelId: channelId!,
            messageId,
            serverId: serverId!,
          })
        }
        className="ml-auto size-4 cursor-pointer text-rose-500 transition hover:text-rose-600 dark:hover:text-rose-300"
      />
    </ActionTooltip>
  );
};
