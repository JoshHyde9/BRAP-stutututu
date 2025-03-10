import { t } from "elysia";

import { ElysiaContext } from "..";

import { MemberRole } from "@workspace/db";

export const memberRouter = (app: ElysiaContext) =>
  app.group("/member", (app) =>
    app
      .patch(
        "/editMemberRole/:serverId",
        async ({ user, prisma, body, params }) => {
          return await prisma.server.update({
            where: {
              id: params.serverId,
              ownerId: user.id,
            },
            data: {
              members: {
                update: {
                  where: {
                    id: body.memberId,
                    userId: {
                      not: user.id,
                    },
                  },
                  data: { role: body.role },
                },
              },
            },
            include: {
              members: {
                include: {
                  user: true,
                },
                orderBy: { role: "asc" },
              },
            },
          });
        },
        {
          auth: true,
          body: t.Object({ memberId: t.String(), role: t.Enum(MemberRole) }),
          params: t.Object({ serverId: t.String() }),
        }
      )
      .patch(
        "/kickMember/:serverId",
        async ({ user, prisma, body, params }) => {
          return await prisma.server.update({
            where: {
              id: params.serverId,
              ownerId: user.id,
            },
            data: {
              members: {
                deleteMany: {
                  id: body.memberId,
                  userId: {
                    not: user.id,
                  },
                },
              },
            },
            include: {
              members: {
                include: {
                  user: true,
                },
                orderBy: { role: "asc" },
              },
            },
          });
        },
        {
          auth: true,
          body: t.Object({ memberId: t.String() }),
          params: t.Object({ serverId: t.String() }),
        }
      )
      .patch(
        "/ban/:serverId/:userId",
        async ({ user, prisma, params, body }) => {
          const [_, server] = await prisma.$transaction([
            prisma.ban.create({
              data: {
                userId: params.userId,
                serverId: params.serverId,
                reason: body.reason,
              },
            }),
            prisma.server.update({
              where: {
                id: params.serverId,
                ownerId: user.id,
              },
              data: {
                members: {
                  deleteMany: {
                    userId: params.userId,
                    NOT: {
                      userId: user.id,
                    },
                  },
                },
              },
              include: {
                members: {
                  include: {
                    user: true,
                  },
                  orderBy: { role: "asc" },
                },
              },
            }),
          ]);

          return server;
        },
        {
          auth: true,
          body: t.Object({ reason: t.String() }),
          params: t.Object({ serverId: t.String(), userId: t.String() }),
        }
      )
      .patch(
        "/editMember/:serverId/:memberId",
        async ({ user, prisma, body, params }) => {
          const trimmedNickname = body.nickname.trim();

          return await prisma.member.update({
            where: {
              id: params.memberId,
              serverId: params.serverId,
              userId: user.id,
            },
            data: {
              nickname: trimmedNickname.length > 1 ? trimmedNickname : null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  displayName: true,
                  createdAt: true,
                },
              },
            },
          });
        },
        {
          auth: true,
          body: t.Object({ nickname: t.String() }),
          params: t.Object({ serverId: t.String(), memberId: t.String() }),
        }
      )
      .get(
        "/loggedInUserServerMember/:serverId",
        async ({ user, prisma, params }) => {
          return await prisma.member.findFirst({
            where: {
              serverId: params.serverId,
              userId: user.id,
            },
          });
        },
        { auth: true, params: t.Object({ serverId: t.String() }) }
      )
  );
