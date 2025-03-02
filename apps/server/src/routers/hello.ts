import { ElysiaContext } from "..";

export const helloRouter = (app: ElysiaContext) =>
  app.group("/hello", (app) =>
    app.get(
      "/me",
      async ({ user, prisma }) => {
        return await prisma.user.findUnique({ where: { id: user.id } });
      },
      { auth: true }
    ).get("/", async ({ prisma }) => {
      return await prisma.user.findMany();
    })
  );
