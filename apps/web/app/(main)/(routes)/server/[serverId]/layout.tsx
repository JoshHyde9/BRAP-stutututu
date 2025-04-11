import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { api } from "@workspace/api";

import { getServerSession } from "@/lib/get-server-session";

import { ServerSidebar } from "@/components/server/server-sidebar";

type ServerIdLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
};

const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
  const session = await getServerSession();
  const queryClient = new QueryClient();
  const headerStore = await headers();

  const { serverId } = await params;

  if (!session) {
    return redirect("/login");
  }

  const server = await queryClient.fetchQuery({
    queryKey: ["server", serverId],
    queryFn: async () => {
      const { data: userServer } = await api.server
        .byIdWithMembersAndChannels({ id: serverId })
        .get({ fetch: { headers: headerStore } });

      return userServer;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["loggedInMember", serverId],
    queryFn: async () => {
      const { data: loggedInMember } = await api.member
        .loggedInUserServerMember({ serverId })
        .get({ fetch: { headers: headerStore } });

      return loggedInMember;
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="fixed inset-y-0 z-20 hidden h-full w-64 flex-col md:flex">
          <ServerSidebar serverId={server.id} />
        </div>
        <main className="h-full md:pl-64">{children}</main>
      </HydrationBoundary>
    </div>
  );
};

export default ServerIdLayout;
