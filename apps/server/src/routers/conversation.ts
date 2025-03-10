import { t } from "elysia";

import { ElysiaContext } from "..";

export const conversationRouter = (app: ElysiaContext) =>
  app.group("/conversation", (app) =>
    app
      .get(
        "/getInitialConversation/:userOneId/:userTwoId",
        async ({ prisma, params }) => {
          return await prisma.conversation.findFirst({
            where: {
              AND: [
                { userOneId: params.userOneId, userTwoId: params.userTwoId },
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
          params: t.Object({ userOneId: t.String(), userTwoId: t.String() }),
        }
      )
      .post(
        "/create",
        async ({ prisma, body }) => {
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
  );
