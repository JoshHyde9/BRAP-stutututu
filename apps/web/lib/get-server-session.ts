import type { Session } from "@workspace/auth";

import { headers } from "next/headers";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_URL
    : "http://localhost:5000";

export const getServerSession = async () => {
  "use server";

  const response = await fetch(`${baseUrl}/api/auth/get-session`, {
    credentials: "include",
    headers: await headers(),
  });

  try {
    return (await response.json()) as Session;
  } catch (error) {
    return null;
  }
};
