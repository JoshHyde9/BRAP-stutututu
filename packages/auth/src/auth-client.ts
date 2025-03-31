import { createAuthClient } from "better-auth/react";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_CORS_URL
    : "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: baseUrl,
});

export const { signIn, signOut, signUp, useSession } = authClient;
