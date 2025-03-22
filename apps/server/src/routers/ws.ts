import { auth, type Session } from "@workspace/auth";
import { ElysiaContext } from "..";
import { t } from "elysia";
import {
  createReaction,
  deleteMessage,
  editMessage,
} from "../lib/ws-message-funcs";
import { getConversationId } from "../lib/util";
import { dmCreateMessage } from "../lib/ws-conversation-funcs";

const wsConnections = new Map<string, Session>();
const channels = new Map<string, Set<string>>();
const servers = new Map<string, Set<string>>();
const conversations = new Map<string, Set<string>>();

export const wsRouter = (app: ElysiaContext) =>
  app.group("/ws", (app) =>
    app.ws("/chat", {
      body: t.Object({
        type: t.Union([
          t.Literal("join"),
          t.Literal("leave"),
          t.Literal("create-chat-message"),
          t.Literal("edit-chat-message"),
          t.Literal("delete-chat-message"),
          t.Literal("create-message-reaction"),
          t.Literal("conversation-join"),
          t.Literal("create-conversation-message"),
        ]),
        data: t.Object({
          channelId: t.Optional(t.String()),
          serverId: t.Optional(t.String()),
          content: t.Optional(t.String()),
          fileUrl: t.Optional(t.String()),
          messageId: t.Optional(t.String()),
          value: t.Optional(t.String()),
          targetId: t.Optional(t.String()),
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
        const {
          channelId,
          serverId,
          content,
          fileUrl,
          messageId,
          value,
          targetId,
        } = message.data;

        switch (message.type) {
          case "join":
            if (!channels.has(channelId!)) {
              channels.set(channelId!, new Set());
            }

            if (!servers.has(serverId!)) {
              servers.set(serverId!, new Set());
            }

            channels.get(channelId!)?.add(ws.id);
            servers.get(serverId!)?.add(ws.id);

            ws.subscribe(`channel:${channelId}`);
            ws.subscribe(`server:${serverId}`);
            break;
          case "leave":
            channels.get(channelId!)?.delete(ws.id);
            servers.get(serverId!)?.delete(ws.id);

            if (channels.get(channelId!)?.size === 0) {
              channels.delete(channelId!);
            }

            if (servers.get(serverId!)?.size === 0) {
              servers.delete(serverId!);
            }

            ws.unsubscribe(`server:${serverId}`);
            ws.unsubscribe(`channel:${channelId}`);
            break;
          case "conversation-join":
            const { conversationId } = await getConversationId(
              prisma,
              session.user.id,
              targetId!
            );

            if (!conversations.has(conversationId)) {
              conversations.set(
                conversationId,
                new Set([session.user.id, targetId!])
              );
            }

            ws.subscribe(`conversation:${conversationId}`);
            break;
          case "create-conversation-message":
            const dmMessage = await dmCreateMessage(prisma, session, {
              content: content!,
              conversationId: conversationId!,
              fileUrl,
            });

            ws.publish(`conversation:${dmMessage.conversationId}`, {
              message: dmMessage,
              type: "create-conversation-message",
            });
            ws.send({
              message: dmMessage,
              type: "create-conversation-message",
            });
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
                originalContent: content as string,
                content: content as string,
                fileUrl: fileUrl,
                channelId: channelId!,
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

            ws.publish(`channel:${channelId}`, {
              message: {
                ...newMessage,
                serverId: server.id,
              },
            });
            ws.send({ message: { ...newMessage, serverId: server.id } });
            ws.publish(`server:${serverId}`, {
              message: { newMessage, serverId: server.id },
            });
            break;
          case "edit-chat-message":
            try {
              const editedMessage = await editMessage(prisma, session, {
                content,
                messageId,
              });

              if (editedMessage) {
                ws.publish(`channel:${channelId}`, {
                  message: editedMessage,
                  type: "edit-chat-message",
                });
                ws.send({ message: editedMessage, type: "edit-chat-message" });
              }
            } catch (error) {
              console.log(error);
            }

            break;
          case "delete-chat-message":
            try {
              const deletedMessage = await deleteMessage(prisma, session, {
                messageId,
                serverId,
              });

              if (deletedMessage) {
                ws.publish(`channel:${channelId}`, {
                  message: deletedMessage,
                  type: "delete-chat-message",
                });
                ws.send({
                  message: deletedMessage,
                  type: "delete-chat-message",
                });
              }
            } catch (error) {
              console.log(error);
            }
            break;
          case "create-message-reaction":
            try {
              const messageReaction = await createReaction(prisma, session, {
                serverId,
                messageId,
                channelId,
                value,
              });

              if (messageReaction) {
                ws.publish(`channel:${channelId}`, {
                  message: messageReaction,
                  type: "create-message-reaction",
                });
                ws.send({
                  message: messageReaction,
                  type: "create-message-reaction",
                });
              }
            } catch (error) {
              console.log(error);
            }
            break;
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

        for (const [serverId, serverMembers] of servers.entries()) {
          if (serverMembers.has(ws.id)) {
            serverMembers.delete(ws.id);

            if (servers.size === 0) {
              servers.delete(serverId);
            }
          }
        }

        wsConnections.delete(ws.id);
      },
    })
  );
