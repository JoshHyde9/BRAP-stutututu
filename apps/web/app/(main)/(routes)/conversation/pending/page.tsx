import { headers } from "next/headers";

import { api } from "@workspace/api";

import { FriendsList } from "@/components/friends/friends-list";

const FriendsPage = async () => {
  const { data: addressees } = await api.friend.pending.get({
    // @ts-ignore
    headers: await headers(),
  });

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <FriendsList type="pending" friends={addressees} />
    </div>
  );
};

export default FriendsPage;
