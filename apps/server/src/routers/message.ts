import { t } from "elysia";

import { ElysiaContext } from "..";
import { MemberRole, Message, User } from "@workspace/db";

type MessageWithMemberWithUser = {
  member: {
    user: Pick<User, "id" | "name" | "displayName" | "image" | "createdAt">;
    id: string;
    updatedAt: Date;
    userId: string;
    serverId: string;
    role: MemberRole;
    nickname: string | null;
  };
} & Message;

export const messageRouter = (app: ElysiaContext) =>
  app.group("/message", (app) =>
    app
      .post(
        "/createMessage/:serverId/:channelId",
        async ({ user, prisma, body, params, error }) => {
          const server = await prisma.server.findFirst({
            where: {
              id: params.serverId,
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
            include: {
              members: true,
            },
          });

          if (!server) {
            return error("Bad Request");
          }

          const channel = await prisma.channel.findFirst({
            where: { id: params.channelId, serverId: params.serverId },
          });

          if (!channel) {
            return error("Bad Request");
          }

          const member = server.members.find(
            (member) => member.userId === user.id
          );

          if (!member) {
            return error("Bad Request");
          }

          const message = await prisma.message.create({
            data: {
              content: body.content,
              fileUrl: body.fileUrl,
              channelId: params.channelId,
              memberId: member.id,
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

          return message;
        },
        {
          auth: true,
          body: t.Object({
            content: t.String(),
            fileUrl: t.Optional(t.String()),
          }),
          params: t.Object({ serverId: t.String(), channelId: t.String() }),
        }
      )
      .get(
        "/channelMessages",
        async ({ query, prisma }) => {
          const MESSAGE_BATCH = 25;

          let messages: MessageWithMemberWithUser[] = [];

          if (query.cursor) {
            messages = await prisma.message.findMany({
              take: MESSAGE_BATCH,
              skip: 1,
              cursor: { id: query.cursor },
              where: { channelId: query.channelId },
              include: {
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
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            });
          } else {
            messages = await prisma.message.findMany({
              take: MESSAGE_BATCH,
              where: { channelId: query.channelId },
              include: {
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
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            });
          }

          let nextCursor: string | undefined = undefined;

          if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1]?.id;
          }

          return { messages, nextCursor };
        },
        {
          auth: true,
          query: t.Object({
            channelId: t.String(),
            cursor: t.Optional(t.String()),
          }),
        }
      )
  );
