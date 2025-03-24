import type { Session } from "@workspace/auth";
import type { PrismaClient } from "@workspace/db";
import type { DirectMesageSortedReaction } from "..";
import {
  countAndSortDirectMessageReactions,
  fetchMessageWithReactions,
} from "./util";

type DMCreateMessage = {
  content: string;
  fileUrl?: string;
  conversationId: string;
};

type DMEditMessage = {
  messageId: string;
  content: string;
};

type DMDeleteMessage = {
  messageId: string;
};

type DMMessageReaction = {
  conversationId: string;
  messageId: string;
  value: string;
};

export const dmCreateMessage = async (
  prisma: PrismaClient,
  session: Session,
  data: DMCreateMessage
) => {
  return await prisma.directMessage.create({
    data: {
      conversationId: data.conversationId,
      originalContent: data.content,
      content: data.content,
      fileUrl: data.fileUrl,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          displayName: true,
          image: true,
          createdAt: true,
        },
      },
    },
  });
};

export const dmEditMesage = async (
  prisma: PrismaClient,
  session: Session,
  data: DMEditMessage
) => {
  return await prisma.directMessage.update({
    where: {
      id: data.messageId,
      userId: session.user.id,
    },
    data: {
      content: data.content,
    },
    include: {
      user: {
        omit: { createdAt: true, email: true, emailVerified: true },
      },
    },
  });
};

export const dmDeleteMessage = async (
  prisma: PrismaClient,
  session: Session,
  data: DMDeleteMessage
) => {
  return await prisma.directMessage.delete({
    where: {
      id: data.messageId,
      userId: session.user.id,
    },
    include: {
      user: {
        omit: { createdAt: true, email: true, emailVerified: true },
      },
    },
  });
};

export const dmMessageReaction = async (
  prisma: PrismaClient,
  session: Session,
  data: DMMessageReaction
) => {
  const messageWithReactions = await fetchMessageWithReactions(
    prisma,
    data.messageId
  );

  const existingReactionFromUser =
    messageWithReactions?.directMessageReactions.find(
      (reaction) =>
        messageWithReactions.id === data.messageId &&
        reaction.userId === session.user.id &&
        reaction.value === data.value
    );

  if (existingReactionFromUser) {
    let message = await prisma.directMessageReaction.delete({
      where: { id: existingReactionFromUser.id },
      include: {
        user: {
          omit: { createdAt: true, emailVerified: true, email: true },
        },
      },
    });

    return { conversationId: data.conversationId, ...message };
  } else {
    await prisma.directMessageReaction.create({
      data: {
        value: data.value,
        userId: session.user.id,
        directMessageId: data.messageId,
      },
    });
  }

  const updatedMessage = await fetchMessageWithReactions(
    prisma,
    data.messageId
  );
  return { conversationId: data.conversationId, ...updatedMessage };
};
