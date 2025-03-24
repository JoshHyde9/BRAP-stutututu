import { treaty } from "@elysiajs/eden";
import type { App } from "@workspace/server";
export type {
  MessageWithSortedReactions,
  SortedReaction,
  DirectMessageWithUser,
  DirectMesageSortedReaction,
  DirectMessageWithReactions,
  DirectMessageWithSortedReactions,
} from "@workspace/server";

export const { api } = treaty<App>("localhost:5000", {
  fetch: { credentials: "include" },
});
