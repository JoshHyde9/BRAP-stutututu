import Elysia from "elysia";

export const helloRouter = new Elysia().group("/hello", (app) =>
  app.get("/", () =>
    new Array(40).fill("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  )
);
