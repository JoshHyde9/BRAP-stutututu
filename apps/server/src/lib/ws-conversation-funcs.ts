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
      content: data.content,
      userId: session.user.id,
    },
  });
};
