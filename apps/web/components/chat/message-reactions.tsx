import { SortedReaction } from "@workspace/api";
import { Member } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";

import { useChatSocket } from "@/hooks/use-chat-socket";

import { AddReaction } from "@/components/chat/add-reaction";

type MessageReactionsProps = {
  reactions: SortedReaction[];
  channelId: string;
  serverId: string;
  messageId: string;
  loggedInMember: Member;
};

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  channelId,
  serverId,
  messageId,
  loggedInMember,
}) => {
  const { messageReaction } = useChatSocket();

  const handleReaction = (emoji: string, messageId: string) => {
    messageReaction.mutate({ value: emoji, channelId, serverId, messageId });
  };

  return (
    <div className="my-1 flex items-center gap-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.id}
          onClick={() => handleReaction(reaction.value, reaction.messageId)}
          className={cn(
            "rounded-md border border-[#f2f3f5] bg-[#f2f3f5] px-3 text-zinc-600 transition hover:border-zinc-300 dark:border-[#2b2d31] dark:bg-[#2b2d31] dark:text-zinc-300 dark:hover:border-[#1e1f22]",
            reaction.memberIds.includes(loggedInMember.id) &&
              "bg-discord/20 border-discord dark:bg-discord/20 dark:border-discord",
          )}
        >
          {reaction.value} <span>{reaction.count}</span>
        </button>
      ))}
      {reactions.length > 0 && (
        <div className="flex items-center">
          <AddReaction
            channelId={channelId}
            messageId={messageId}
            serverId={serverId}
            variant="button"
          />
        </div>
      )}
    </div>
  );
};
