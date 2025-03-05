import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@workspace/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:3000"],
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          displayName: profile.global_name
        };
      },
    },
  },
  user: {
    additionalFields: {
      displayName: {
        type: "string",
        required: false,
        input: false
      }
    }
  }
});

export type Session = typeof auth.$Infer.Session;
