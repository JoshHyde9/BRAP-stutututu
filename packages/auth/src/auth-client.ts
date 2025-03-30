import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.SERVER_URL ?? "http://localhost:5000",
});

export const { signIn, signOut, signUp, useSession } = authClient;
