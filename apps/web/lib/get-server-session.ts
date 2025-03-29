import type { Session } from "@workspace/auth";
import { headers } from "next/headers";

export const getServerSession = async () => {
  "use server";

  const response = await fetch(`${process.env.DEPLOYED_URL ?? process.env.SERVER_URL ?? 'http://localhost:5000'}/api/auth/get-session`, {
    credentials: "include",
    headers: await headers(),
  });
  
  try {
    return await response.json() as Session;
  } catch (error) {
    return null;
  }
};
