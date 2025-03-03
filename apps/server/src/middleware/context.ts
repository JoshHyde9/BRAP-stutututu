import { Elysia } from "elysia";
import { auth } from "@workspace/auth";
import { prisma } from "@workspace/db";

export const elysiaContext = new Elysia()
  .mount(auth.handler)
  .decorate({ prisma })
  .macro({
    auth: {
      async resolve({ error, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return error(401);
        
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
