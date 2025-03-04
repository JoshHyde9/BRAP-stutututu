import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@workspace/api";
import { getServerSession } from "@/lib/get-server-session";

import { ServerSidebar } from "@/components/server/server-sidebar";

type ServerIdLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
};

const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
  const session = await getServerSession();
  const { serverId } = await params;

  if (!session) {
    return redirect("/login");
  }

  const { data: server } = await api.server
    .byId({ id: serverId })
    .get({ fetch: { headers: await headers() } });


  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-64 flex-col md:flex">
        <ServerSidebar serverId={server.id} />
      </div>
      <main className="h-full md:pl-64">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
