import { Session } from "@workspace/auth";
import { PrismaClient } from "@workspace/db";

type DMCreateMessage = {
  content: string;
  fileUrl?: string;
  conversationId: string;
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
