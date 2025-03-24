import type { DirectMessageSortedReaction } from "@workspace/server";

import { cn } from "@workspace/ui/lib/utils";

import { useConversations } from "@/hooks/use-conversations";

import { AddDirectMessageReaction } from "./add-reaction";

type DirectMessageReactionsProps = {
  reactions: DirectMessageSortedReaction[];
  conversationId: string;
  messageId: string;
  userId: string;
};

export const DirectMessageReactions: React.FC<DirectMessageReactionsProps> = ({
  reactions,
  conversationId,
  messageId,
  userId,
}) => {
  const { messageReaction } = useConversations({});

  const handleReaction = (emoji: string) => {
    messageReaction.mutate({ value: emoji, messageId, conversationId });
  };

  return (
    <div className="my-1 flex flex-wrap items-center gap-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.id}
          onClick={() => handleReaction(reaction.value)}
          className={cn(
            "rounded-md border border-[#f2f3f5] bg-[#f2f3f5] px-3 text-zinc-600 transition hover:border-zinc-300 dark:border-[#2b2d31] dark:bg-[#2b2d31] dark:text-zinc-300 dark:hover:border-[#1e1f22]",
            reaction.userIds.includes(userId) &&
              "bg-discord/20 border-discord dark:bg-discord/20 dark:border-discord",
          )}
        >
          {reaction.value} <span>{reaction.count}</span>
        </button>
      ))}
      {reactions.length > 0 && (
        <div className="flex items-center">
          <AddDirectMessageReaction
            messageId={messageId}
            conversationId={conversationId}
            variant="button"
          />
        </div>
      )}
    </div>
  );
};
