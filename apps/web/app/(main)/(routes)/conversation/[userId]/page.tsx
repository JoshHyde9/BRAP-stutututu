import { redirect } from "next/navigation";

import { getOrCreateConversation } from "@/lib/conversation";
import { getServerSession } from "@/lib/get-server-session";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ConversationMessages } from "@/components/conversation/conversation-messages";

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

  const otherUser = userOne.id === session.user.id ? userTwo : userOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        type="conversation"
        name={otherUser.displayName ?? otherUser.name}
        imageUrl={otherUser.image}
      />
      <ConversationMessages
        loggedInUser={session.user}
        otherUsername={otherUser.displayName ?? otherUser.name}
        conversationId={conversation.id}
      />
      <ChatInput
        type="conversation"
        targetId={otherUser.id}
        queryParams={{ conversationId: conversation.id }}
        name={otherUser.name}
      />
    </div>
  );
};

export default ConversationUserPage;
