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
  );
