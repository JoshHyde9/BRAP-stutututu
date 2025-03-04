import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

import { api } from "@workspace/api";
import { getServerSession } from "@/lib/get-server-session";

type InviteCodePageProps = {
  params: Promise<{ inviteCode: string }>;
};

export const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const session = await getServerSession();
  const { inviteCode } = await params;
  const headerStore = await headers();

  if (!session) {
    return redirect("/login");
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const { data: existingServer } = await api.server
    .byServerInviteCode({ inviteCode })
    .get({ fetch: { headers: headerStore } });

  if (existingServer) {
    return redirect(`/server/${existingServer.id}`);
  }

  const { data: server } = await api.server.addNewMember.put(
    { inviteCode },
    {
      headers: headerStore,
    }
  );

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
