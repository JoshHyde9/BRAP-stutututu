import { redirect } from "next/navigation";

import { getOrCreateConversation } from "@/lib/conversation";
import { getServerSession } from "@/lib/get-server-session";

import { UserAvatar } from "@/components/user-avatar";

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
      <div className="flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
        <UserAvatar
          src={otherMember.image}
          name={otherMember.name}
          className="mr-2 size-8 md:size-8"
        />
        <p className="font-semibold">
          {otherMember.displayName ?? otherMember.name}
        </p>
      </div>
    </div>
  );
};

export default ConversationUserPage;
