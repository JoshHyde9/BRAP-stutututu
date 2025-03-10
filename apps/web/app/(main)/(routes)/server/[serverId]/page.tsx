import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@workspace/api";

import { getServerSession } from "@/lib/get-server-session";

type ServerIDPage = {
  params: Promise<{ serverId: string }>;
};

const ServerPage: React.FC<ServerIDPage> = async ({ params }) => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/login");
  }

  const { serverId } = await params;

  const { data: server } = await api.server
    .byIdWithGeneral({ serverId })
    .get({ fetch: { headers: await headers() } });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/server/${serverId}/channel/${initialChannel.id}`);
};

export default ServerPage;
