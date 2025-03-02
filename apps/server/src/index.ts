import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { elysiaContext } from "./middleware/context";
import { betterAuthView } from "./auth-view";

import { helloRouter } from "./routers/hello";

const app = new Elysia({ prefix: "/api" })
  .use(elysiaContext)
  .use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(helloRouter)
  .all("/auth/*", betterAuthView)
  .listen(5000);

console.log(
  `Server is running at http://${app.server?.hostname}:${app.server?.port}/api`
);

export type App = typeof app;
export type ElysiaContext = typeof elysiaContext;