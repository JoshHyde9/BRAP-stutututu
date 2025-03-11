import { redirect } from "next/navigation";

import { getOrCreateConversation } from "@/lib/conversation";
import { getServerSession } from "@/lib/get-server-session";

import { ChatHeader } from "@/components/chat/chat-header";

type ConversationUserPageProps = {
  params: Promise<{ userId: string }>;
};

const ConversationUserPage: React.FC<ConversationUserPageProps> = async ({
  params,
}) => {
  const session = await getServerSession();
  const { userId } = await params;

  if (!session) {
    return redirect("/login");
  }

  const conversation = await getOrCreateConversation({
    userOneId: session.user.id,
    userTwoId: userId,
  });

  if (!conversation) {
    return redirect("/");
  }

  const { userOne, userTwo } = conversation;

  const otherMember = userOne.id === session.user.id ? userTwo : userOne;

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="conversation"
        name={otherMember.displayName ?? otherMember.name}
        imageUrl={otherMember.image}
      />
    </div>
  );
};

export default ConversationUserPage;
