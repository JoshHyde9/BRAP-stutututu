import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/get-server-session";

import { prisma } from "@workspace/db";

import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/login");
  }

  const server = await prisma.server.findFirst({
    where: { members: { some: { userId: session.user.id } } },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return (
      <InitialModal />
  );
};

export default SetupPage;
