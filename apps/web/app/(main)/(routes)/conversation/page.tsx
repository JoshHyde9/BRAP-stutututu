import { headers } from "next/headers";

import { api } from "@workspace/api";

import { ChatHeader } from "@/components/chat/chat-header";
import { FriendsList } from "@/components/friends/friends-list";

const FriendsPage = async () => {
  const { data: friends } = await api.friend.all.get({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader type="friends" />

      <FriendsList friends={friends} />
    </div>
  );
};

export default FriendsPage;
