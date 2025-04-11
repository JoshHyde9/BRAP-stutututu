"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@workspace/api";

import { FriendsList } from "@/components/friends/friends-list";

const FriendsPage = () => {
  const { data: friends } = useQuery({
    queryKey: ["all"],
    queryFn: async () => {
      const { data: friends } = await api.friend.all.get();

      return friends;
    },
  });

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <FriendsList type="friends" friends={friends} />
    </div>
  );
};

export default FriendsPage;
