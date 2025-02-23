import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { helloRouter } from "./routers/hello";

const app = new Elysia({ prefix: "/api" })
  .use(cors())
  .use(helloRouter)
  .listen(5000);

console.log(
  `Server is running at http://${app.server?.hostname}:${app.server?.port}/api`
);

export type App = typeof app;
