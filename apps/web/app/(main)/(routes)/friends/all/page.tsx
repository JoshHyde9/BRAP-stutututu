import { headers } from "next/headers";

import { api } from "@workspace/api";

import { FriendsList } from "@/components/friends/friends-list";

const FriendsPage = async () => {
  const { data: friends } = await api.friend.all.get({
    //@ts-ignore
    headers: await headers(),
  });

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <FriendsList type="friends" friends={friends} />
    </div>
  );
};

export default FriendsPage;
