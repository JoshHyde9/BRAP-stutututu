import { Session } from "@workspace/auth";
import { PrismaClient } from "@workspace/db";

type MessageData = {
  serverId?: string | undefined;
  content?: string | undefined;
  fileUrl?: string | undefined;
  messageId?: string | undefined;
  channelId?: string;
};

export const editMessage = async (
  prisma: PrismaClient,
  session: Session,
  data: MessageData
) => {
  const message = await prisma.message.findUnique({
    where: { id: data.messageId },
    select: {
      member: { select: { userId: true } },
    },
  });

  const isMessageOwner = message?.member.userId === session.user.id;

  if (!isMessageOwner) {
    throw new Error("Don't try to be sneaky");
  }

  const editedMessage = await prisma.message.update({
    where: {
      id: data.messageId,
    },
    data: {
      content: data.content,
    },
    include: {
      member: {
        omit: { createdAt: true },
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
      },
    },
  });

  return editedMessage;
};
