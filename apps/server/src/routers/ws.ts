import { ElysiaContext } from "..";

export const wsRouter = (app: ElysiaContext) =>
  app.group("/ws", (app) => app.ws("/chat", () => {}));
