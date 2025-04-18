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
  process.env.NODE_ENV === "production" ? "https://ripcord.jimslab.cc" : "http://localhost:5000";

export const { api } = treaty<App>(baseUrl!, {
  fetch: { credentials: "include" },
});
