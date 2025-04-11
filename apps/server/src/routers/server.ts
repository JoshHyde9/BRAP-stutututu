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
            include: {
              channels: {
                where: {
                  name: "general"
                }
              }
            }
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
        "/byIdWithGeneral/:serverId",
        async ({ user, prisma, params }) => {
          return await prisma.server.findUnique({
            where: {
              id: params.serverId,
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
            include: {
              channels: {
                where: {
                  name: "general",
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          });
        },
        {
          auth: true,
          params: t.Object({ serverId: t.String() }),
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
      .patch(
        "/leave/:serverId",
        async ({ user, prisma, params }) => {
          await prisma.server.update({
            where: {
              id: params.serverId,
              ownerId: {
                not: user.id,
              },
              members: {
                some: {
                  userId: user.id,
                },
              },
            },
            data: {
              members: {
                deleteMany: {
                  userId: user.id,
                },
              },
            },
          });

          return { success: true };
        },
        {
          auth: true,
          params: t.Object({ serverId: t.String() }),
        }
      )
      .delete(
        "/deleteServer/:serverId",
        async ({ user, prisma, params }) => {
          await prisma.server.delete({
            where: {
              id: params.serverId,
              ownerId: user.id,
            },
          });

          return { success: true };
        },
        {
          auth: true,
          params: t.Object({ serverId: t.String() }),
        }
      )
      .get(
        "/bans/:serverId",
        async ({ user, prisma, params, error }) => {
          const loggedInMember = await prisma.member.findFirst({
            where: { userId: user.id, serverId: params.serverId },
          });

          if (!loggedInMember) {
            return error("Bad Request");
          }

          const canBan =
            loggedInMember.role === "ADMIN" ||
            loggedInMember.role === "MODERATOR";

          if (!canBan) {
            return error("Bad Request");
          }

          return await prisma.ban.findMany({
            where: { serverId: params.serverId },
            omit: { updatedAt: true, userId: true },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  displayName: true,
                },
              },
            },
          });
        },
        {
          auth: true,
          params: t.Object({ serverId: t.String() }),
        }
      )
      .patch(
        "/unBan/:serverId",
        async ({ user, prisma, params, body, error }) => {
          const loggedInMember = await prisma.member.findFirst({
            where: { userId: user.id, serverId: params.serverId },
          });

          if (!loggedInMember) {
            return error("Bad Request");
          }

          const canBan =
            loggedInMember.role === "ADMIN" ||
            loggedInMember.role === "MODERATOR";

          if (!canBan) {
            return error("Bad Request");
          }

          await prisma.ban.delete({
            where: {
              id: body.banId
            },
          });

          return { success: true };
        },
        {
          auth: true,
          params: t.Object({ serverId: t.String() }),
          body: t.Object({ banId: t.String() }),
        }
      )
  );
