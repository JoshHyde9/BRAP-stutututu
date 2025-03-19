import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { elysiaContext } from "./middleware/context";
import { betterAuthView } from "./auth-view";

import { serverRouter } from "./routers/server";
import { memberRouter } from "./routers/member";
import { channelRouter } from "./routers/channel";
import { conversationRouter } from "./routers/conversation";
import { messageRouter } from "./routers/message";
import { wsRouter } from "./routers/ws";
import { Message, Member, User, Reaction } from "@workspace/db";

const app = new Elysia({ prefix: "/api" })
  .use(elysiaContext)
  .use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(serverRouter)
  .use(memberRouter)
  .use(channelRouter)
  .use(conversationRouter)
  .use(messageRouter)
  .use(wsRouter)
  .all("/auth/*", betterAuthView)
  .listen(5000);

console.log(
  `Server is running at http://${app.server?.hostname}:${app.server?.port}/api`
);

export type App = typeof app;
export type ElysiaContext = typeof elysiaContext;

export type MessageWithReactions = Message & {
  member: Member & {
    user: Pick<User, "id" | "name" | "displayName" | "image" | "createdAt">;
  };
  reactions: Omit<Reaction, "updatedAt">[];
};

export type SortedReaction = Omit<Reaction, "updatedAt"> & {
  count: number;
  memberIds: string[];
};

export type MessageWithSortedReactions = MessageWithReactions & {
  reactions: SortedReaction[];
};
