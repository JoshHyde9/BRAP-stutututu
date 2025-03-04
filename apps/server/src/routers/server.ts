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
                    select: { id: true, image: true, name: true, },
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
  );
