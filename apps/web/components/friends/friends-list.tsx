import type { User } from "@workspace/db";

import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { FriendItem } from "@/components/friends/friend-item";

type Friend = {
  id: string;
  friend: Pick<User, "id" | "name" | "displayName" | "image" | "createdAt">;
};

type FriendsListProps = {
  friends: Friend[] | null;
  type: "friends" | "requested" | "pending";
};

export const FriendsList: React.FC<FriendsListProps> = ({ friends, type }) => {
  return (
    <div className="p-5">
      <ScrollArea className="flex-1">
        <p className="text-sm font-semibold uppercase">
          {type === "friends"
            ? "All friends"
            : type === "requested"
              ? "Requests"
              : "Pending"}{" "}
          &mdash; {friends?.length}
        </p>
        <div className="mt-6">
          {friends &&
            friends.map((friendship) => (
              <FriendItem
                type={type}
                key={friendship.id}
                friend={friendship.friend}
                friendshipId={friendship.id}
              />
            ))}
        </div>
        {type === "friends" && friends && friends.length <= 0 && (
          <p>You should consider adding a friend</p>
        )}
      </ScrollArea>
    </div>
  );
};
