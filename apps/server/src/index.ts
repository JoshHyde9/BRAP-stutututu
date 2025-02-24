import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { helloRouter } from "./routers/hello";
import { prisma } from "@workspace/db";

const prismaPlugin = new Elysia().decorate({ ctx: { prisma } }).as("plugin");

const app = new Elysia({ prefix: "/api" })
  .use(prismaPlugin)
  .use(cors())
  .use(helloRouter)
  .listen(5000);

console.log(
  `Server is running at http://${app.server?.hostname}:${app.server?.port}/api`
);

// TODO: Surely there's a better way to do this
export type WithPrismaPlugin = typeof prismaPlugin;

export type App = typeof app;
