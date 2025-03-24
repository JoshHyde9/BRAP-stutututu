import { headers } from "next/headers";

import { api } from "@workspace/api";

type getOrCreateConversationProps = {
  userOneId: string;
  userTwoId: string;
};

export const getOrCreateConversation = async ({
  userOneId,
  userTwoId,
}: getOrCreateConversationProps) => {
  "use server";
  const headerStore = await headers();

  const { data: conversation } =
    await api.conversation.getInitialConversation.get({
      query: { userOneId, userTwoId },
      fetch: { headers: headerStore },
    });

  if (!conversation) {
    return (
      await api.conversation.create.post(
        { userOneId, userTwoId },
        { headers: headerStore },
      )
    ).data;
  }

  return conversation;
};
