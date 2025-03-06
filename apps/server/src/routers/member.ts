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
  );
