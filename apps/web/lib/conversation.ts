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

  let { data: conversation } =
    (await api.conversation
      .getInitialConversation({ userOneId })({
        userTwoId,
      })
      .get({ fetch: { headers: headerStore } })) ??
    (await api.conversation
      .getInitialConversation({ userOneId: userTwoId })({
        userTwoId: userOneId,
      })
      .get({ fetch: { headers: headerStore } }));

  if (!conversation) {
    conversation = (
      await api.conversation.create.post(
        { userOneId, userTwoId },
        { headers: headerStore },
      )
    ).data;
  }

  return conversation;
};
