import { auth, type Session } from "@workspace/auth";
import { ElysiaContext } from "..";
import { t } from "elysia";
import {
  createReaction,
  deleteMessage,
  editMessage,
} from "../lib/ws-message-funcs";
import { getConversationId } from "../lib/util";
import {
  dmCreateMessage,
  dmDeleteMessage,
  dmEditMesage,
  dmMessageReaction,
} from "../lib/ws-conversation-funcs";
import { ElysiaWS } from "elysia/ws";

const wsConnections = new Map<string, ElysiaWS>();
const userSessions = new Map<string, Session>();
const userConversations = new Map<string, Set<string>>();
const channels = new Map<string, Set<string>>();
const servers = new Map<string, Set<string>>();
const conversations = new Map<string, Set<string>>();

const handleConversationsDisconnect = (userId: string) => {
  const userConvos = userConversations.get(userId);
  if (!userConvos) return;

  for (const convoId of userConvos) {
    const convoUsers = conversations.get(convoId);
    if (!convoUsers) continue;

    convoUsers.delete(userId);

    if (convoUsers.size === 0) {
      conversations.delete(convoId);
    }
  }

  userConversations.delete(userId);
};

const addUserToConversation = (userId: string, convoId: string) => {
  if (!conversations.has(convoId)) {
    conversations.set(convoId, new Set());
  }

  conversations.get(convoId)!.add(userId);

  if (!userConversations.has(userId)) {
    userConversations.set(userId, new Set());
  }
  userConversations.get(userId)!.add(convoId);
};

export const wsRouter = (app: ElysiaContext) =>
  app.group("/ws", (app) =>
    app.ws("/chat", {
      body: t.Object({
        type: t.Union([
          t.Literal("join-chat"),
          t.Literal("leave-chat"),
          t.Literal("create-message-chat"),
          t.Literal("edit-message-chat"),
          t.Literal("delete-message-chat"),
          t.Literal("create-message-reaction"),
          t.Literal("join-conversation"),
          t.Literal("create-message-conversation"),
          t.Literal("edit-message-conversation"),
          t.Literal("delete-message-conversation"),
          t.Literal("create-reaction-conversation"),
        ]),
        data: t.Object({
          channelId: t.Optional(t.String()),
          serverId: t.Optional(t.String()),
          content: t.Optional(t.String()),
          fileUrl: t.Optional(t.String()),
          messageId: t.Optional(t.String()),
          value: t.Optional(t.String()),
          targetId: t.Optional(t.String()),
          conversationId: t.Optional(t.String()),
        }),
      }),
      open: async (ws) => {
        const headers = ws.data.request.headers;

        const session = await auth.api.getSession({ headers });

        if (!session) {
          return ws.close(3000, "Unauthorized");
        }

        wsConnections.set(session.user.id, ws);
        userSessions.set(ws.id, session);
      },
      message: async (ws, message) => {
        const session = userSessions.get(ws.id);

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
          conversationId,
        } = message.data;

        switch (message.type) {
          case "join-chat":
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
          case "leave-chat":
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
          case "join-conversation":
            const conversation = await getConversationId(
              prisma,
              session.user.id,
              targetId!
            );

            addUserToConversation(session.user.id, conversation.conversationId);

            ws.subscribe(`conversation:${conversation.conversationId}`);
            const targetSocket = wsConnections.get(targetId!);

            if (targetSocket) {
              targetSocket.subscribe(
                `conversation:${conversation.conversationId}`
              );
            }

            break;
          case "create-message-conversation":
            const dmMessage = await dmCreateMessage(prisma, session, {
              content: content!,
              conversationId: conversationId!,
              fileUrl,
            });

            ws.publish(`conversation:${dmMessage.conversationId}`, {
              message: dmMessage,
              type: "create-message-conversation",
            });
            ws.send({
              message: dmMessage,
              type: "create-message-conversation",
            });
            break;
          case "create-message-chat":
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
              type: "create-message-chat",
            });
            ws.send({
              message: {
                ...newMessage,
                serverId: server.id,
              },
              type: "create-message-chat",
            });
            ws.publish(`server:${serverId}`, {
              message: {
                newMessage,
                serverId: server.id,
              },
              type: "create-message-chat",
            });
            break;
          case "edit-message-chat":
            try {
              const editedMessage = await editMessage(prisma, session, {
                content,
                messageId,
              });

              if (editedMessage) {
                ws.publish(`channel:${channelId}`, {
                  message: editedMessage,
                  type: "edit-message-chat",
                });
                ws.send({ message: editedMessage, type: "edit-message-chat" });
              }
            } catch (error) {
              console.log(error);
            }

            break;
          case "edit-message-conversation":
            try {
              const editedMessage = await dmEditMesage(prisma, session, {
                content: content!,
                messageId: messageId!,
              });

              if (editedMessage) {
                ws.publish(`conversation:${editedMessage.conversationId}`, {
                  message: editedMessage,
                  type: "edit-message-conversation",
                });
                ws.send({
                  message: editedMessage,
                  type: "edit-message-conversation",
                });
              }
            } catch (error) {
              console.log(error);
            }

            break;
          case "delete-message-conversation":
            try {
              const deletedMessage = await dmDeleteMessage(prisma, session, {
                messageId: messageId!,
              });

              if (deletedMessage) {
                ws.publish(`conversation:${deletedMessage.conversationId}`, {
                  message: deletedMessage,
                  type: "delete-message-conversation",
                });
                ws.send({
                  message: deletedMessage,
                  type: "delete-message-conversation",
                });
              }
            } catch (error) {
              console.log(error);
            }

            break;
          case "delete-message-chat":
            try {
              const deletedMessage = await deleteMessage(prisma, session, {
                messageId,
                serverId,
              });

              if (deletedMessage) {
                ws.publish(`channel:${channelId}`, {
                  message: deletedMessage,
                  type: "delete-message-chat",
                });
                ws.send({
                  message: deletedMessage,
                  type: "delete-message-chat",
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
          case "create-reaction-conversation":
            try {
              const messageReaction = await dmMessageReaction(prisma, session, {
                conversationId: conversationId!,
                messageId: messageId!,
                value: value!,
              });

              if (messageReaction) {
                ws.publish(`conversation:${conversationId}`, {
                  message: messageReaction,
                  type: "create-reaction-conversation",
                });
                ws.send({
                  message: messageReaction,
                  type: "create-reaction-conversation",
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

        const session = userSessions.get(ws.id);

        if (!session) return;

        handleConversationsDisconnect(session.user.id);

        wsConnections.delete(ws.id);
        userSessions.delete(ws.id);
      },
    })
  );
