import { Session } from "@workspace/auth";
import { PrismaClient } from "@workspace/db";

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
