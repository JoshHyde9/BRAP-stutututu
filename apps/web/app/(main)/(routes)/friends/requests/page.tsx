"use client";

import { FriendsList } from "@/components/friends/friends-list";
import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/api";

const RequestedFriendsPage = () => {
   const {data: requesters} =  useQuery({
      queryKey: ["requesters"],
      queryFn: async () => {
        const { data: requesters } = await api.friend.requested.get();
  
        return requesters;
      },
    });
 

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <FriendsList type="requested" friends={requesters} />
    </div>
  );
};

export default RequestedFriendsPage;
