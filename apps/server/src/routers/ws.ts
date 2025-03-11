import { auth, type Session } from "@workspace/auth";
import { ElysiaContext } from "..";

const wsConnections = new Map<string, Session>();

export const wsRouter = (app: ElysiaContext) =>
  app.group("/ws", (app) =>
    app.ws("/chat", {
      open: async (ws) => {
        const headers = ws.data.request.headers;

        const session = await auth.api.getSession({ headers });

        if (!session) {
          return ws.close(3000, "Unauthorized");
        }

        wsConnections.set(ws.id, session);
      },
      message: async (ws, message) => {
        const session = wsConnections.get(ws.id);

        if (!session) {
          return ws.close(3000, "Unauthorized");
        }

        console.log({
          message,
          user: session.user,
          session: session.session,
        });
      },
      close: (ws) => {
        wsConnections.delete(ws.id);
      },
    })
  );
