import { t } from "elysia";
import { v4 as uuidv4 } from "uuid";

import { ElysiaContext } from "..";

import { MemberRole } from "@workspace/db";

export const serverRouter = (app: ElysiaContext) =>
  app.group("/server", (app) =>
    app
      .get(
        "/all",
        async ({ user, prisma }) => {
          return await prisma.server.findMany({
            where: {
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
          });
        },
        { auth: true }
      )
      .post(
        "/create",
        async ({ user, prisma, body }) => {
          return await prisma.server.create({
            data: {
              ownerId: user.id,
              name: body.name,
              imageUrl: body.imageUrl,
              inviteCode: uuidv4(),
              channels: {
                create: [{ name: "general", userId: user.id }],
              },
              members: {
                create: [{ userId: user.id, role: MemberRole.ADMIN }],
              },
            },
            select: { id: true },
          });
        },
        {
          auth: true,
          body: t.Object({ name: t.String(), imageUrl: t.String() }),
        }
      )
      .get(
        "/byId/:id",
        async ({ user, prisma, params }) => {
          return await prisma.server.findUnique({
            where: {
              id: params.id,
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
          });
        },
        {
          auth: true,
          params: t.Object({ id: t.String() }),
        }
      )
      .get(
        "/byIdWithMembersAndChannels/:id",
        async ({ user, prisma, params }) => {
          return await prisma.server.findUnique({
            where: {
              id: params.id,
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
            include: {
              channels: { orderBy: { createdAt: "asc" } },
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      image: true,
                      name: true,
                      displayName: true,
                      createdAt: true,
                    },
                  },
                },
                orderBy: { role: "asc" },
              },
            },
          });
        },
        {
          auth: true,
          params: t.Object({ id: t.String() }),
        }
      )
      .post(
        "/newInviteCode",
        async ({ user, prisma, body }) => {
          return await prisma.server.update({
            where: {
              id: body.id,
              ownerId: user.id,
            },
            data: {
              inviteCode: uuidv4(),
            },
            select: {
              inviteCode: true,
            },
          });
        },
        {
          auth: true,
          body: t.Object({ id: t.String() }),
        }
      )
      .get(
        "/byServerInviteCode/:inviteCode",
        async ({ user, prisma, params }) => {
          return await prisma.server.findFirst({
            where: {
              OR: [
                {
                  inviteCode: params.inviteCode,
                  members: {
                    some: {
                      userId: user.id,
                    },
                  },
                },
                {
                  inviteCode: params.inviteCode,
                  bans: {
                    some: {
                      userId: user.id,
                    },
                  },
                },
              ],
            },
            select: { id: true, inviteCode: true },
          });
        },
        {
          auth: true,
          params: t.Object({ inviteCode: t.String() }),
        }
      )
      .put(
        "/addNewMember",
        async ({ user, prisma, body }) => {
          return await prisma.server.update({
            where: {
              inviteCode: body.inviteCode,
            },
            data: {
              members: {
                create: [{ userId: user.id }],
              },
            },
            select: { id: true },
          });
        },
        {
          auth: true,
          body: t.Object({ inviteCode: t.String() }),
        }
      )
      .patch(
        "/editServer/:serverId",
        async ({ user, prisma, params, body }) => {
          await prisma.server.update({
            where: {
              id: params.serverId,
              ownerId: user.id,
            },
            data: {
              name: body.name,
              imageUrl: body.imageUrl,
            },
          });

          return { success: true };
        },
        {
          auth: true,
          body: t.Object({ name: t.String(), imageUrl: t.String() }),
          params: t.Object({ serverId: t.String() }),
        }
      )
  );
