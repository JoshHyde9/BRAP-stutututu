import { treaty } from "@elysiajs/eden";
import type { App } from "@workspace/server";
export type {
  MessageWithSortedReactions,
  SortedReaction,
  DirectMessageWithUser,
  DirectMessageSortedReaction,
  DirectMessageWithReactions,
  DirectMessageWithSortedReactions,
} from "@workspace/server";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CORS_URL || process.env.NEXT_PUBLIC_CORS_URL
    : "http://localhost:5000";

export const { api } = treaty<App>(baseUrl!, {
  fetch: { credentials: "include" },
});
