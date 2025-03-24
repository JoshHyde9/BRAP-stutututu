import { SortedReaction } from "@workspace/api";
import { Session } from "@workspace/auth";
import { Member } from "@workspace/db";
import { DirectMessageSortedReaction } from "@workspace/server";
import { cn } from "@workspace/ui/lib/utils";

import { useReactions } from "@/hooks/message/use-reaction";
import { QueryParamsKeys } from "@/lib/types";

import { AddReaction } from "@/components/chat/add-reaction";

type BaseReaction = {
  value: string;
  id: string;
  count: number;
  userIds?: string[];
  memberIds?: string[];
  userId?: string;
  memberId?: string;
  directMessageId?: string;
  messageId?: string;
  createdAt: Date;
};

type MessageReactionsProps = {
  reactions: BaseReaction[];
  queryParams: QueryParamsKeys;
  messageId: string;
  loggedInMember: Member | Session["user"];
};

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  queryParams,
  messageId,
  loggedInMember,
}) => {
  const messageReaction = useReactions();

  const handleReaction = (emoji: string, messageId: string) => {
    messageReaction.mutate({
      value: emoji,
      messageId,
      queryParams,
    });
  };

  const hasUserReacted = (reaction: BaseReaction) => {
    const reactionUserIds = reaction.userIds || reaction.memberIds;
    return reactionUserIds?.includes(loggedInMember.id);
  };

  return (
    <div className="my-1 flex flex-wrap items-center gap-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.id}
          onClick={() =>
            handleReaction(
              reaction.value,
              reaction.messageId! || reaction.directMessageId!,
            )
          }
          className={cn(
            "rounded-md border border-[#f2f3f5] bg-[#f2f3f5] px-3 text-zinc-600 transition hover:border-zinc-300 dark:border-[#2b2d31] dark:bg-[#2b2d31] dark:text-zinc-300 dark:hover:border-[#1e1f22]",
            hasUserReacted(reaction) &&
              "bg-discord/20 border-discord dark:bg-discord/20 dark:border-discord",
          )}
        >
          {reaction.value} <span>{reaction.count}</span>
        </button>
      ))}
      {reactions.length > 0 && (
        <div className="flex items-center">
          <AddReaction
            queryParams={queryParams}
            messageId={messageId}
            variant="button"
          />
        </div>
      )}
    </div>
  );
};
