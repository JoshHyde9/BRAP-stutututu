import { auth, type Session } from "@workspace/auth";
import { ElysiaContext } from "..";
import { t } from "elysia";
import { EventEmitter } from "events";

const chatEvents = new EventEmitter();
const wsConnections = new Map<string, Session>();

export const wsRouter = (app: ElysiaContext) =>
  app.group("/ws", (app) =>
    app.ws("/chat", {
      body: t.Union([
        t.Object({ type: t.Literal("new-message") }),
        t.Object({
          type: t.Literal("create-chat-message"),
          data: t.Object({
            serverId: t.String(),
            channelId: t.String(),
            content: t.String(),
            fileUrl: t.Optional(t.String()),
          }),
        }),
      ]),
      open: async (ws) => {
        const headers = ws.data.request.headers;

        const session = await auth.api.getSession({ headers });

        if (!session) {
          return ws.close(3000, "Unauthorized");
        }

        ws.subscribe("message");
        wsConnections.set(ws.id, session);
      },
      message: async (ws, message) => {
        const session = wsConnections.get(ws.id);

        if (!session) {
          return ws.close(3000, "Unauthorized");
        }

        switch (message.type) {
          case "create-chat-message":
            const { prisma } = ws.data;
            const { data } = message;

            const server = await prisma.server.findFirst({
              where: {
                id: data.serverId,
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
              where: { id: data.channelId, serverId: data.serverId },
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
                content: data.content,
                fileUrl: data.fileUrl,
                channelId: data.channelId,
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

            const eventKey = `chat:${data.channelId}:messages`;
            chatEvents.emit(eventKey, newMessage);
            ws.publish("message", { message: newMessage });
            ws.send({ message: newMessage });
        }
      },
      close: (ws) => {
        wsConnections.delete(ws.id);
      },
    })
  );
