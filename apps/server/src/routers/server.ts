import { t } from "elysia";
import { v4 as uuidv4 } from "uuid";

import { ElysiaContext } from "..";

import { MemberRole } from "@workspace/db";

export const serverRouter = (app: ElysiaContext) =>
  app.group("/server", (app) =>
    app.post(
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
      { auth: true, body: t.Object({ name: t.String(), imageUrl: t.String() }) }
    )
  );
