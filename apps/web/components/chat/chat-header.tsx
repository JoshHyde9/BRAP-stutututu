import { Hash, UserRound } from "lucide-react";

import { Separator } from "@workspace/ui/components/separator";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";

import { FriendsLinks } from "@/components/friends/friends-links";

type FriendsChatHeaderProps = {
  type: "friends";
  serverId?: never;
  imageUrl?: never;
  name?: never;
};

type ChatHeaderProps =
  | {
      type: "channel" | "conversation";
      serverId?: string;
      imageUrl?: string | null;
      name: string;
    }
  | FriendsChatHeaderProps;

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  serverId,
  type,
  imageUrl,
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
          <FriendsLinks />
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
      <p className="font-semibold">{name}</p>
    </div>
  );
};
