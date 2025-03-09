import { Context } from "elysia";
import { auth } from "@workspace/auth";

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET", "PUT", "PATCH", "DELETE"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    console.log(context.request);
    return auth.handler(context.request);
  } else {
    context.error(405);
  }
};
