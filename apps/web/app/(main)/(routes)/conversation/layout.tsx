import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/get-server-session";

import { ConversationSidebar } from "@/components/chat/conversation-sidebar";

type ConversationLayoutProps = {
  children: React.ReactNode;
};

const ConversationLayout = async ({ children }: ConversationLayoutProps) => {
  const session = await getServerSession();

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-64 flex-col md:flex">
        <ConversationSidebar />
      </div>
      <main className="h-full md:pl-64">{children}</main>
    </div>
  );
};

export default ConversationLayout;
