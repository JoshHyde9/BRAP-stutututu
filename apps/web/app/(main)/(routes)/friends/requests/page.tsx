import { headers } from "next/headers";

import { api } from "@workspace/api";

import { FriendsList } from "@/components/friends/friends-list";

const RequestedFriendsPage = async () => {
  const { data: requesters } = await api.friend.requested.get({
    // @ts-ignore
    headers: await headers(),
  });

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <FriendsList type="requested" friends={requesters} />
    </div>
  );
};

export default RequestedFriendsPage;
