import { Trash } from "lucide-react";

import { useConversations } from "@/hooks/use-conversations";

import { ActionTooltip } from "@/components/action-tooltip";

type DeleteConversationMessage = {
  messageId: string;
};

export const DeleteConversationMessage: React.FC<DeleteConversationMessage> = ({
  messageId,
}) => {
  const { deleteMessage } = useConversations({});

  return (
    <ActionTooltip label="Delete">
      <Trash
        onClick={() =>
          deleteMessage.mutate({
            messageId,
          })
        }
        className="ml-auto size-4 cursor-pointer text-rose-500 transition hover:text-rose-600 dark:hover:text-rose-300"
      />
    </ActionTooltip>
  );
};
