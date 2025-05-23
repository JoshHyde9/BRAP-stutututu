import type { PrismaClient } from "@workspace/db";
import type {
  MessageWithReactions,
  SortedReaction,
  MessageWithSortedReactions,
  DirectMessageSortedReaction,
  DirectMessageWithReactions,
  DirectMessageWithSortedReactions,
} from "..";

export function countAndSortReactions(
  input: MessageWithReactions[]
): MessageWithSortedReactions[];
export function countAndSortReactions(
  input: MessageWithReactions
): MessageWithSortedReactions;
export function countAndSortReactions(
  input: MessageWithReactions | MessageWithReactions[]
): MessageWithSortedReactions | MessageWithSortedReactions[] {
  const messages = Array.isArray(input) ? input : [input];

  const sortedMessages = messages.map((message) => {
    const sortedReactions = message.reactions.reduce(
      (sortedArray, reaction) => {
        const existingReaction = sortedArray.findIndex(
          (item) => item.value === reaction.value
        );

        if (existingReaction >= 0) {
          sortedArray[existingReaction]!.count =
            (sortedArray[existingReaction]!.count || 0) + 1;

          sortedArray[existingReaction]?.memberIds.push(reaction.memberId);
        } else {
          const newEntry: SortedReaction = {
            ...reaction,
            count: 1,
            memberIds: [reaction.memberId],
          };

          sortedArray.push(newEntry);
        }
        return sortedArray;
      },
      [] as SortedReaction[]
    );

    return {
      ...message,
      reactions: sortedReactions,
    } as MessageWithSortedReactions;
  });

  return Array.isArray(input) ? sortedMessages : sortedMessages[0]!;
}

export function countAndSortDirectMessageReactions(
  input: DirectMessageWithReactions[]
): DirectMessageWithSortedReactions[];
export function countAndSortDirectMessageReactions(
  input: DirectMessageWithReactions
): DirectMessageWithSortedReactions;
export function countAndSortDirectMessageReactions(
  input: DirectMessageWithReactions | DirectMessageWithReactions[]
): DirectMessageWithSortedReactions | DirectMessageWithSortedReactions[] {
  const messages = Array.isArray(input) ? input : [input];

  const sortedMessages = messages.map((message) => {
    const sortedReactions = message.directMessageReactions.reduce(
      (sortedArray, reaction) => {
        const existingReaction = sortedArray.findIndex(
          (item) => item.value === reaction.value
        );

        if (existingReaction >= 0) {
          sortedArray[existingReaction]!.count =
            (sortedArray[existingReaction]!.count || 0) + 1;

          sortedArray[existingReaction]?.userIds.push(reaction.userId);
        } else {
          const newEntry: DirectMessageSortedReaction = {
            ...reaction,
            count: 1,
            userIds: [reaction.userId],
          };

          sortedArray.push(newEntry);
        }
        return sortedArray;
      },
      [] as DirectMessageSortedReaction[]
    );

    return {
      ...message,
      directMessageReactions: sortedReactions,
    } as DirectMessageWithSortedReactions;
  });

  return Array.isArray(input) ? sortedMessages : sortedMessages[0]!;
}

export const getConversationId = async (
  prisma: PrismaClient,
  userOneId: string,
  userTwoId: string
) => {
  let conversation = await prisma.conversation.findUnique({
    where: {
      userOneId_userTwoId: {
        userOneId,
        userTwoId,
      },
    },
    select: { id: true },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userOneId,
        userTwoId,
      },
      select: {
        id: true,
      },
    });
  }

  return { conversationId: conversation.id };
};

export const fetchMessageWithReactions = async (prisma: PrismaClient, messageId: string) => {
  const message = await prisma.directMessage.findUnique({
    where: {
      id: messageId,
    },
    include: {
      directMessageReactions: {
        include: {
          user: {
            omit: { emailVerified: true, email: true, updatedAt: true },
          },
        },
        omit: { updatedAt: true },
      },
      user: { omit: { emailVerified: true, email: true, updatedAt: true } },
    },
  });

  return message ? countAndSortDirectMessageReactions(message) : null;
};
