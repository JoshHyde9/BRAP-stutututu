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
