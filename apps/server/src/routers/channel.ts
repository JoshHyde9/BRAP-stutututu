import { t } from "elysia";
import { ChannelType, MemberRole } from "@workspace/db";

import { ElysiaContext } from "..";

export const channelRouter = (app: ElysiaContext) =>
  app.group("/channel", (app) =>
    app
      .post(
        "/create/:serverId",
        async ({ user, prisma, body, params, error }) => {
          if (params.serverId.trim() === "") {
            return error("Bad Request", "Server id canot be empty.");
          }

          if (body.name.toLowerCase() === "general") {
            return error("Bad Request", "Channel name cannot be 'general'.");
          }

          // Replace all spaces with "-" and convert to lowercase if channel type is a text channel
          const sanitisedName =
            body.type === "TEXT"
              ? body.name.replace(/\s+/g, "-").toLowerCase()
              : body.name;

          return await prisma.server.update({
            where: {
              id: params.serverId,
              members: {
                some: {
                  userId: user.id,
                  role: {
                    in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                  },
                },
              },
            },
            data: {
              channels: {
                create: {
                  userId: user.id,
                  name: sanitisedName,
                  type: body.type,
                },
              },
            },
          });
        },
        {
          auth: true,
          body: t.Object({
            name: t.String(),
            type: t.Enum(ChannelType),
          }),
          params: t.Object({ serverId: t.String() }),
        },
      )
      .delete(
        "/deleteChannel/:serverId/:channelId",
        async ({ user, prisma, params }) => {
          await prisma.server.update({
            where: {
              id: params.serverId,
              members: {
                some: {
                  userId: user.id,
                  role: {
                    in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                  },
                },
              },
            },
            data: {
              channels: {
                delete: {
                  id: params.channelId,
                  name: {
                    not: "general",
                  },
                },
              },
            },
          });

          return { success: true };
        },
        {
          auth: true,
          params: t.Object({ serverId: t.String(), channelId: t.String() }),
        },
      )
      .patch(
        "/editChannel/:serverId/:channelId",
        async ({ user, prisma, params, body }) => {
          // Replace all spaces with "-" and convert to lowercase if channel type is a text channel
          const sanitisedName =
            body.type === "TEXT"
              ? body.name.replace(/\s+/g, "-").toLowerCase()
              : body.name;

          return await prisma.server.update({
            where: {
              id: params.serverId,
              members: {
                some: {
                  userId: user.id,
                  role: {
                    in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                  },
                },
              },
            },
            data: {
              channels: {
                update: {
                  where: { id: params.channelId, name: { not: "general" } },
                  data: {
                    name: sanitisedName,
                    type: body.type,
                  },
                },
              },
            },
          });
        },
        {
          auth: true,
          body: t.Object({ name: t.String(), type: t.Enum(ChannelType) }),
          params: t.Object({ serverId: t.String(), channelId: t.String() }),
        },
      )
      .get(
        "/byId/:channelId",
        async ({ prisma, params }) => {
          return await prisma.channel.findUnique({
            where: { id: params.channelId },
          });
        },
        {
          auth: true,
          params: t.Object({ channelId: t.String() }),
        },
      )
      .get("/pinnedMessages/:channelId", async ({ prisma, params }) => {
        return await prisma.pinnedMessage.findMany({
          where: {
            channelId: params.channelId,
          },
          include: {
            message: {
              select: {
                id: true,
                content: true,
                fileUrl: true,
                createdAt: true,
                member: {
                  select: {
                    nickname: true,
                    user: {
                      select: {
                        image: true,
                        displayName: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }),
  );
