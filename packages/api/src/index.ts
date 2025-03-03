import { treaty } from "@elysiajs/eden/treaty2";
import type { App } from "@workspace/server";

export const { api } = treaty<App>("localhost:5000", {
  fetch: { credentials: "include" },
});
