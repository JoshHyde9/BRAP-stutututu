import { Session } from "@workspace/auth";
import { PrismaClient } from "@workspace/db";
import { countAndSortReactions } from "./util";

type MessageData = {
  serverId?: string | undefined;
  content?: string | undefined;
  fileUrl?: string | undefined;
  messageId?: string | undefined;
  channelId?: string;
  value?: string;
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

export const deleteMessage = async (
  prisma: PrismaClient,
  session: Session,
  data: MessageData
) => {
  const [server, message] = await prisma.$transaction([
    prisma.server.findUnique({
      where: { id: data.serverId },
      select: { members: { select: { userId: true, role: true } } },
    }),
    prisma.message.findUnique({
      where: { id: data.messageId },
      select: {
        member: { select: { userId: true } },
      },
    }),
  ]);

  const member = server?.members.find(
    (member) => member.userId === session.user.id
  );

  const isMessageOwner = message?.member.userId === session.user.id;
  const isAdmin = member?.role === "ADMIN";
  const isModerator = member?.role === "MODERATOR";
  const canDelete = isMessageOwner || isAdmin || isModerator;

  if (!canDelete) {
    throw new Error("Don't try to be sneaky");
  }

  return await prisma.message.delete({
    where: { id: data.messageId },
    select: { id: true, channelId: true },
  });
};

export const createReaction = async (
  prisma: PrismaClient,
  session: Session,
  data: MessageData
) => {
  const [message, member] = await prisma.$transaction([
    prisma.message.findUnique({
      where: { id: data.messageId },
      include: {
        reactions: true,
        member: {
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
            reactions: {
              omit: {
                updatedAt: true,
              },
            },
          },
        },
      },
    }),
    prisma.member.findFirst({
      where: { serverId: data.serverId, userId: session.user.id },
    }),
  ]);

  if (!message || !member || !data.value) {
    return new Error("Bad Request");
  }

  const sortedMessage = countAndSortReactions({
    ...message,
    serverId: member.serverId,
  });

  const existingReactionFromUser = message.reactions.find(
    (reaction) =>
      sortedMessage.id === data.messageId &&
      reaction.memberId === member.id &&
      reaction.value === data.value
  );

  if (existingReactionFromUser) {
    let message = await prisma.reaction.delete({
      where: { id: existingReactionFromUser.id },
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

    const messageWithChannelId: typeof message & { channelId: string } = {
      channelId: data.channelId!,
      ...message,
    };

    return messageWithChannelId;
  } else {
    await prisma.reaction.create({
      data: {
        memberId: member.id,
        messageId: message.id,
        value: data.value,
      },
    });
    return sortedMessage;
  }
};
