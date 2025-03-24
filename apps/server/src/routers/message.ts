import { t } from "elysia";

import { ElysiaContext } from "..";
import { countAndSortReactions } from "../lib/util";

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
              originalContent: body.content,
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

          const messages = await prisma.message.findMany({
            take: MESSAGE_BATCH,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
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
              reactions: { omit: { updatedAt: true } },
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          // @ts-ignore
          const messagesWithSortedReactions = countAndSortReactions(messages);

          let nextCursor: string | undefined = undefined;

          if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1]?.id;
          }

          return { messages: messagesWithSortedReactions, nextCursor };
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
