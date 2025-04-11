"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@workspace/api";

import { FriendsList } from "@/components/friends/friends-list";

const FriendsPage = () => {
  const { data: pending } = useQuery({
    queryKey: ["pending"],
    queryFn: async () => {
      const { data: pending } = await api.friend.pending.get();

      return pending;
    },
  });

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <FriendsList type="pending" friends={pending} />
    </div>
  );
};

export default FriendsPage;
