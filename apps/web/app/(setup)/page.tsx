import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@workspace/api";

import { getServerSession } from "@/lib/get-server-session";

import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/login");
  }

  const { data: server } = await api.server.findFirst.get({
    fetch: { headers: await headers() },
  });

  if (server) {
    return redirect(`/server/${server.id}/channel/${server.channels[0]?.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
