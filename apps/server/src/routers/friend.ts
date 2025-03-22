import { t } from "elysia";

import { ElysiaContext } from "..";

export const friendRouter = (app: ElysiaContext) =>
  app.group("/friend", (app) =>
    app
      .post(
        "/sendRequest",
        async ({ user, prisma, body, error }) => {
          const addressedUser = await prisma.user.findFirst({
            where: {
              OR: [{ name: body.name }, { displayName: body.name }],
            },
            select: { id: true },
          });

          if (!addressedUser) {
            return error("Bad Request");
          }

          await prisma.friend.create({
            data: {
              requesterId: user.id,
              addresseeId: addressedUser.id,
            },
          });

          return { success: true };
        },
        {
          auth: true,
          body: t.Object({
            name: t.String(),
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
      .get(
        "/pending",
        async ({ user, prisma }) => {
          const sent = await prisma.friend.findMany({
            where: {
              requesterId: user.id,
              status: "PENDING",
            },
            include: {
              addressee: {
                omit: {
                  email: true,
                  emailVerified: true,
                  updatedAt: true,
                },
              },
            },
          });

          return [
            ...sent.map((friend) => ({
              id: friend.id,
              friend: friend.addressee,
            })),
          ];
        },
        {
          auth: true,
        }
      )
      .get(
        "/requested",
        async ({ user, prisma }) => {
          const requests = await prisma.friend.findMany({
            where: {
              requesterId: { not: user.id },
              status: "PENDING",
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
          });

          return [
            ...requests.map((friend) => ({
              id: friend.id,
              friend: friend.requester,
            })),
          ];
        },
        { auth: true }
      )
      .delete(
        "/cancel",
        async ({ user, prisma, body }) => {
          await prisma.friend.delete({
            where: {
              id: body.requestId,
              status: "PENDING",
              requesterId: user.id,
            },
          });

          return { success: true };
        },
        {
          auth: true,
          body: t.Object({ requestId: t.String() }),
        }
      )
      .delete(
        "/ignore",
        async ({ user, prisma, body }) => {
          await prisma.friend.delete({
            where: {
              id: body.requestId,
              status: "PENDING",
              addresseeId: user.id,
            },
          });

          return { success: true };
        },
        {
          auth: true,
          body: t.Object({
            requestId: t.String(),
          }),
        }
      )
      .patch(
        "/accept",
        async ({ user, prisma, body }) => {
          await prisma.friend.update({
            where: {
              id: body.requestId,
              addresseeId: user.id,
            },
            data: {
              status: "ACCEPTED",
            },
          });

          return { success: true };
        },
        {
          auth: true,
          body: t.Object({ requestId: t.String() }),
        }
      )
      .delete(
        "/remove",
        async ({ prisma, body }) => {
          await prisma.friend.delete({
            where: {
              id: body.friendshipId,
              status: "ACCEPTED",
            },
          });

          return { success: true };
        },
        {
          auth: true,
          body: t.Object({
            friendshipId: t.Optional(t.String()),
          }),
        }
      )
  );
