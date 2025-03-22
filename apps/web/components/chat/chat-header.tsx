import Link from "next/link";
import { Hash, UserRound } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";

type FriendsChatHeaderProps = {
  type: "friends";
  serverId?: never;
  imageUrl?: never;
  name?: never;
};

type ChatHeaderProps =
  | {
      params: string;
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
          <Link href="/conversation/all">
            <Button variant="ghost" size="sm" className="px-4">
              All
            </Button>
          </Link>
          <Link href="/conversation/pending">
            <Button variant="ghost" size="sm" className="px-4">
              Pending
            </Button>
          </Link>
          <Link href="/conversation/requests">
            <Button variant="ghost" size="sm" className="px-4">
              Requests
            </Button>
          </Link>
          <Link href="/conversation/add-friend">
            <Button size="sm">Add Friend</Button>
          </Link>
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
