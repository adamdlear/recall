import staticPlugin from "@elysiajs/static";
import Elysia from "elysia";
import indexHtml from "public/index.html";
import { apiRouter } from "./server";

const app = new Elysia()
  .use(apiRouter)
  .use(
    await staticPlugin()
  )
  .get("/*", indexHtml)
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);
