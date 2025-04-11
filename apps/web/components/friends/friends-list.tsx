"use client";

import type { User } from "@workspace/db";

import { useState } from "react";

import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

import { FriendItem } from "@/components/friends/friend-item";
import { Search } from "lucide-react";

type Friend = {
  id: string;
  friend: Pick<User, "id" | "name" | "displayName" | "image" | "createdAt">;
};

type FriendsListProps = {
  friends: Friend[] | null | undefined;
  type: "friends" | "requested" | "pending";
};

export const FriendsList: React.FC<FriendsListProps> = ({ friends, type }) => {
  const [query, setQuery] = useState("");

  const filteredFriends = friends?.filter(({ friend }) => {
    return (
      friend.name.toLowerCase().includes(query.toLowerCase()) ||
      friend.displayName?.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="px-5 pb-5 pt-2">
      <div className="mb-4 relative">
        <Search className="absolute top-2.5 left-2.5 size-4 text-zinc-400 dark:text-zinc-400" />
        <Input
          type="text"
          placeholder="Search..."
          className="pl-8 font-semibold border-none bg-zinc-200/90 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <p className="text-sm font-semibold uppercase">
          {type === "friends"
            ? "All friends"
            : type === "requested"
              ? "Requests"
              : "Pending"}{" "}
          &mdash; {filteredFriends?.length}
        </p>

        <div className="mt-6">
          {filteredFriends &&
            filteredFriends.map((friendship) => (
              <FriendItem
                type={type}
                key={friendship.id}
                friend={friendship.friend}
                friendshipId={friendship.id}
              />
            ))}
        </div>

        {type === "friends" &&
          filteredFriends &&
          filteredFriends.length <= 0 && (
            <div className="text-center">
              <p>Loner, lol</p>
            </div>
          )}
      </ScrollArea>
    </div>
  );
};
