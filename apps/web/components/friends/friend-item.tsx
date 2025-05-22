import type { User } from "@workspace/db";

import { MessageCircle, MoreVertical } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { ActionTooltip } from "@/components/action-tooltip";
import { UserAvatar } from "@/components/user-avatar";

import { AcceptFriendRequest } from "./accept-friend-request";
import { CancelFriendRequest } from "./cancel-friend-request";
import { IgnoreFriendRequest } from "./ignore-friend-request";
import { RemoveFriend } from "./remove-friend";

type FriendItemProps = {
  type: "friends" | "pending" | "requested";
  friend: Pick<User, "id" | "name" | "displayName" | "image" | "createdAt">;
  friendshipId: string;
};

export const FriendItem: React.FC<FriendItemProps> = ({
  friend,
  type,
  friendshipId,
}) => {
  return (
    <div className="group mx-5 flex cursor-pointer border-t border-b-transparent py-3 last-of-type:border-b last-of-type:border-b-zinc-300 hover:mx-2 hover:rounded-md hover:border-transparent hover:bg-zinc-300 hover:px-3 dark:border-t-zinc-700 dark:last-of-type:border-b-zinc-700 dark:hover:bg-zinc-700">
      <div className="flex w-full items-center">
        <div className="flex items-center gap-x-2">
          <UserAvatar name={friend.name} src={friend.image} />
          <div className="flex gap-x-2">
            <p className="font-semibold text-zinc-600 dark:text-zinc-300">
              {friend.displayName ?? friend.name}
            </p>
            <p className="text-muted-foreground text-sm opacity-0 group-hover:opacity-100">
              {friend.name}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-x-2">
          {type === "friends" && (
            <>
              <Link href={`/conversation/${friend.id}`}>
                <ActionTooltip label="Message">
                  <div className="flex items-center rounded-full bg-zinc-200 p-2.5 outline-none dark:bg-zinc-800/40">
                    <MessageCircle className="fill-zinc-600 stroke-zinc-600 dark:fill-zinc-300 dark:stroke-zinc-300" />
                  </div>
                </ActionTooltip>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ActionTooltip label="More">
                    <div className="flex items-center rounded-full bg-zinc-200 p-2.5 dark:bg-zinc-800/40">
                      <MoreVertical className="fill-zinc-600 stroke-zinc-600 dark:fill-zinc-300 dark:stroke-zinc-300" />
                    </div>
                  </ActionTooltip>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left">
                  <RemoveFriend
                    friendshipId={friendshipId}
                    username={friend.displayName ?? friend.name}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {type === "pending" && (
            <CancelFriendRequest requestId={friendshipId} />
          )}
          {type === "requested" && (
            <>
              <AcceptFriendRequest requestId={friendshipId} />
              <IgnoreFriendRequest requestId={friendshipId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
