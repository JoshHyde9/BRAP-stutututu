import { auth, type Session } from "@workspace/auth";
import { ElysiaContext } from "..";
import { t } from "elysia";

const wsConnections = new Map<string, Session>();
const channels = new Map<string, Set<string>>();

export const wsRouter = (app: ElysiaContext) =>
  app.group("/ws", (app) =>
    app.ws("/chat", {
      body: t.Object({
        type: t.Union([
          t.Literal("join"),
          t.Literal("leave"),
          t.Literal("create-chat-message"),
        ]),
        data: t.Object({
          channelId: t.String(),
          serverId: t.Optional(t.String()),
          content: t.Optional(t.String()),
          fileUrl: t.Optional(t.String()),
        }),
      }),
      open: async (ws) => {
        const headers = ws.data.request.headers;

        const session = await auth.api.getSession({ headers });

        if (!session) {
          return ws.close(3000, "Unauthorized");
        }

        wsConnections.set(ws.id, session);
      },
      message: async (ws, message) => {
        const session = wsConnections.get(ws.id);

        if (!session) {
          return ws.close(3000, "Unauthorized");
        }

        const { prisma } = ws.data;
        const { channelId, serverId, content, fileUrl } = message.data;

        switch (message.type) {
          case "join":
            if (!channels.has(channelId)) {
              channels.set(channelId, new Set());
            }

            channels.get(channelId)?.add(ws.id);

            ws.subscribe(`channel:${channelId}`);
            break;
          case "leave":
            channels.get(channelId)?.delete(ws.id);

            if (channels.get(channelId)?.size === 0) {
              channels.delete(channelId);
            }

            ws.unsubscribe(`channel:${channelId}`);
            break;
          case "create-chat-message":
            const server = await prisma.server.findFirst({
              where: {
                id: serverId,
                members: {
                  some: {
                    userId: session.user.id,
                  },
                },
              },
              include: {
                members: true,
              },
            });

            if (!server) {
              return ws.data.error("Bad Request");
            }

            const channel = await prisma.channel.findFirst({
              where: { id: channelId, serverId: serverId },
            });

            if (!channel) {
              return ws.data.error("Bad Request");
            }

            const member = server.members.find(
              (member) => member.userId === session.user.id
            );

            if (!member) {
              return ws.data.error("Bad Request");
            }

            const newMessage = await prisma.message.create({
              data: {
                content: content as string,
                fileUrl: fileUrl,
                channelId: channelId,
                memberId: member.id,
              },
              include: {
                member: {
                  omit: { createdAt: true },
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        displayName: true,
                        image: true,
                        createdAt: true,
                      },
                    },
                  },
                },
              },
            });

            ws.publish(`channel:${channelId}`, { message: newMessage });
            ws.send({ message: newMessage });
        }
      },
      close: (ws) => {
        for (const [channelId, channelMembers] of channels.entries()) {
          if (channelMembers.has(ws.id)) {
            channelMembers.delete(ws.id);

            if (channels.size === 0) {
              channels.delete(channelId);
            }
          }
        }

        wsConnections.delete(ws.id);
      },
    })
  );
