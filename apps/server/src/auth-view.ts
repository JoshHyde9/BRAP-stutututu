import type { Context } from "elysia";
import { auth } from "@workspace/auth";

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET", "PUT", "PATCH", "DELETE"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    if (process.env.NODE_ENV === "development") {
      console.log(context.request);
    }
    return auth.handler(context.request);
  }

  context.error(405);
};
