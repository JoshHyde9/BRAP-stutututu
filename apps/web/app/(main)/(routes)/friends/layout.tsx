import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { api } from "@workspace/api";

import { getServerSession } from "@/lib/get-server-session";

import { ChatHeader } from "@/components/chat/chat-header";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";

type FriendsLayoutProps = {
  children: React.ReactNode;
};

const FriendsLayout = async ({ children }: FriendsLayoutProps) => {
  const session = await getServerSession();
  const headerStore = await headers();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["requesters"],
    queryFn: async () => {
      const { data: requesters } = await api.friend.requested.get({
        // @ts-ignore
        headers: headerStore,
      });

      return requesters;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["all"],
    queryFn: async () => {
      const { data: friends } = await api.friend.all.get({
        // @ts-ignore
        headers: headerStore,
      });

      return friends;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["pending"],
    queryFn: async () => {
      const { data: pending } = await api.friend.pending.get({
        // @ts-ignore
        headers: headerStore,
      });

      return pending;
    },
  });

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-64 flex-col md:flex">
        <ConversationSidebar />
      </div>
      <main className="h-full md:pl-64">
        <ChatHeader type="friends" />
        <HydrationBoundary state={dehydrate(queryClient)}>
          {children}
        </HydrationBoundary>
      </main>
    </div>
  );
};

export default FriendsLayout;
