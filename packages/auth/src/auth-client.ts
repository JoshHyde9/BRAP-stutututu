import { createAuthClient } from "better-auth/react";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://ripcord.jimslab.cc"
    : "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: baseUrl,
});

export const { signIn, signOut, signUp, useSession } = authClient;
