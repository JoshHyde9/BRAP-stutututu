import type { QueryParamsKeys } from "@/lib/types";

import { Trash } from "lucide-react";

import { useDeleteMessage } from "@/hooks/message/use-delete";

import { ActionTooltip } from "@/components/action-tooltip";

type DeleteMessageProps = {
  queryParams?: Pick<QueryParamsKeys, "channelId" | "serverId">;
  messageId: string;
};

export const DeleteMessage: React.FC<DeleteMessageProps> = ({
  queryParams,
  messageId,
}) => {
  const deleteMessage = useDeleteMessage();

  return (
    <ActionTooltip label="Delete">
      <Trash
        onClick={() =>
          deleteMessage.mutate({
            queryParams,
            messageId,
          })
        }
        className="ml-auto size-4 cursor-pointer text-rose-500 transition hover:text-rose-600 dark:hover:text-rose-300"
      />
    </ActionTooltip>
  );
};
