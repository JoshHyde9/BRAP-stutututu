import { WithPrismaPlugin } from "..";

export const helloRouter = (app: WithPrismaPlugin) =>
  app.group("/hello", (app) =>
    app.get("/", async ({ ctx }) => {
      const posts = await ctx.prisma.post.findMany();
      return posts;
    })
  );
