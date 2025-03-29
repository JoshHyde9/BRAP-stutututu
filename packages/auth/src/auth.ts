import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@workspace/db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://web:3000", "http://localhost:3000", `${process.env.DEPLOYED_URL}:3000"`],
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          displayName: profile.global_name,
        };
      },
    },
  },
  user: {
    additionalFields: {
      displayName: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
});

export type Session = typeof auth.$Infer.Session;
