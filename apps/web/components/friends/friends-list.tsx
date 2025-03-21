import type { User } from "@workspace/db";

import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { FriendItem } from "@/components/friends/friend-item";

type Friend = {
  id: string;
  friend: Pick<User, "id" | "name" | "displayName" | "image" | "createdAt">;
};

type FriendsListProps = {
  friends: Friend[] | null;
};

export const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  if (!friends) {
    return (
      <div className="flex-1">
        <h1>You have no friends</h1>
      </div>
    );
  }
  return (
    <div className="p-5">
      <ScrollArea className="flex-1">
        <p className="text-sm font-semibold uppercase">
          All friends - {friends.length}
        </p>
        <div className="mt-6">
          {friends.map((friendship) => (
            <FriendItem key={friendship.id} friend={friendship.friend} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
