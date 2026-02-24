import Elysia from "elysia";
import { apiRouter } from "./server";

const app = new Elysia()
	.use(apiRouter)
	.onError(({ code, request }) => {
		if (code === "NOT_FOUND" && !new URL(request.url).pathname.startsWith("/api/")) {
			return new Response(Bun.file("public/index.html"), {
				headers: { "Content-Type": "text/html" },
			});
		}
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);
