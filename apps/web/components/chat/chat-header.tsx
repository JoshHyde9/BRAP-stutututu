import type { Member } from "@workspace/db";

import { Hash, UserRound } from "lucide-react";

import { Separator } from "@workspace/ui/components/separator";

import { PinnedMessages } from "@/components/chat/pinned-messages/pinned-messages";
import { FriendsTabs } from "@/components/friends/friends-tabs";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";

type FriendsChatHeaderProps = {
  type: "friends";
  serverId?: never;
  imageUrl?: never;
  name?: never;
  channelId?: never;
  loggedInMember?: never;
};

type ChatHeaderProps =
  | {
      type: "channel" | "conversation";
      serverId?: string;
      imageUrl?: string | null;
      name: string;
      channelId: string;
      loggedInMember: Member;
    }
  | FriendsChatHeaderProps;

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  serverId,
  type,
  imageUrl,
  channelId,
  loggedInMember,
}) => {
  if (type === "friends") {
    return (
      <div className="mb-4 flex h-12 items-center border-b-2 border-neutral-200 px-3 dark:border-neutral-800">
        <MobileToggle serverId={serverId} type={type} />
        <div className="flex w-full items-center gap-x-2">
          <UserRound />
          <p className="font-semibold">Friends</p>
          <div className="h-6">
            <Separator
              orientation="vertical"
              className="bg-zinc-300 dark:bg-zinc-400"
            />
          </div>
          <FriendsTabs />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} type={type} />
      {type === "channel" ? (
        <Hash className="mr-2 size-5 text-zinc-500 dark:text-zinc-400" />
      ) : (
        <UserAvatar name={name} src={imageUrl} className="mr-2" />
      )}
      <div className="flex w-full pr-2">
        <p className="font-semibold">{name}</p>
        <PinnedMessages loggedInMember={loggedInMember} channelId={channelId} />
      </div>
    </div>
  );
};
