import { t } from "elysia";

import type { ElysiaContext } from "..";
import { countAndSortDirectMessageReactions } from "../lib/util";

export const conversationRouter = (app: ElysiaContext) =>
  app.group("/conversation", (app) =>
    app
      .get(
        "/getInitialConversation",
        async ({ prisma, query }) => {
          return await prisma.conversation.findFirst({
            where: {
              OR: [
                { userOneId: query.userOneId, userTwoId: query.userTwoId },
                { userOneId: query.userTwoId, userTwoId: query.userOneId },
              ],
            },
            include: {
              userOne: {
                select: {
                  id: true,
                  name: true,
                  displayName: true,
                  image: true,
                  createdAt: true,
                },
              },
              userTwo: {
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
        },
        {
          auth: true,
          query: t.Object({ userOneId: t.String(), userTwoId: t.String() }),
        }
      )
      .post(
        "/create",
        async ({ prisma, body }) => {
          return await prisma.$transaction(async (tx) => {
            const existingConversation = await tx.conversation.findFirst({
              where: {
                OR: [
                  { userOneId: body.userOneId, userTwoId: body.userTwoId },
                  { userOneId: body.userTwoId, userTwoId: body.userOneId },
                ],
              },
              include: {
                userOne: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true,
                    image: true,
                    createdAt: true,
                  },
                },
                userTwo: {
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

            if (existingConversation) {
              return existingConversation;
            }

            return await prisma.conversation.create({
              data: { userOneId: body.userOneId, userTwoId: body.userTwoId },
              include: {
                userOne: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true,
                    image: true,
                    createdAt: true,
                  },
                },
                userTwo: {
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
          });
        },
        {
          auth: true,
          body: t.Object({ userOneId: t.String(), userTwoId: t.String() }),
        }
      )
      .get(
        "/all",
        async ({ prisma, user }) => {
          return await prisma.conversation.findMany({
            where: {
              OR: [{ userOneId: user.id }, { userTwoId: user.id }],
            },
            include: {
              userOne: {
                select: {
                  id: true,
                  name: true,
                  displayName: true,
                  image: true,
                  createdAt: true,
                },
              },
              userTwo: {
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
        },
        { auth: true }
      )
      .get(
        "/messages",
        async ({ prisma, query }) => {
          const MESSAGE_BATCH = 25;
          const messages = await prisma.directMessage.findMany({
            take: MESSAGE_BATCH,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            where: {
              conversationId: query.conversationId,
            },
            include: {
              directMessageReactions: {
                omit: {
                  updatedAt: true,
                },
              },
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
            orderBy: {
              createdAt: "desc",
            },
          });

          const directMessagesWithSortedReactions =
            countAndSortDirectMessageReactions(messages);

          let nextCursor: string | undefined = undefined;

          if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1]?.id;
          }

          return { messages: directMessagesWithSortedReactions, nextCursor };
        },
        {
          auth: true,
          query: t.Object({
            conversationId: t.String(),
            cursor: t.Optional(t.String()),
          }),
        }
      )
  );
