import { t } from "elysia";
import { ChannelType, MemberRole } from "@workspace/db";

import { ElysiaContext } from "..";

export const channelRouter = (app: ElysiaContext) =>
  app.group("/channel", (app) =>
    app.post(
      "/create/:serverId",
      async ({ user, prisma, body, params, error }) => {

        if (params.serverId.trim() === "") {
            return error("Bad Request", "Server id canot be empty.")
        }

        if (body.name.toLowerCase() === "general") {
          return error("Bad Request", "Channel name cannot be 'general'.");
        }

        // Replace all spaces with "-" and convert to lowercase
        const sanitisedName = body.name.replace(/\s+/g, "-").toLowerCase();
        
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
      }
    )
  );
