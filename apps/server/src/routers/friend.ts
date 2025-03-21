import { t } from "elysia";

import { ElysiaContext } from "..";

export const friendRouter = (app: ElysiaContext) =>
  app.group("/friend", (app) =>
    app
      .post(
        "/sendRequest",
        async ({ user, prisma, body }) => {
          return await prisma.friend.create({
            data: {
              requesterId: user.id,
              addresseeId: body.userId,
            },
          });
        },
        {
          auth: true,
          body: t.Object({
            userId: t.String(),
          }),
        }
      )
      .get(
        "/all",
        async ({ user, prisma }) => {
          const usersFriends = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            include: {
              friendsRequested: {
                where: { status: "ACCEPTED" },
                include: {
                  addressee: {
                    omit: { email: true, emailVerified: true, updatedAt: true },
                  },
                },
              },
              friendsReceived: {
                where: {
                  status: "ACCEPTED",
                },
                include: {
                  requester: {
                    omit: {
                      email: true,
                      emailVerified: true,
                      updatedAt: true,
                    },
                  },
                },
              },
            },
          });

          if (!usersFriends) return null;

          return [
            ...usersFriends.friendsRequested.map((friend) => ({
              id: friend.id,
              friend: friend.addressee,
            })),
            ...usersFriends.friendsReceived.map((friend) => ({
              id: friend.id,
              friend: friend.requester,
            })),
          ];
        },
        {
          auth: true,
        }
      )
  );
