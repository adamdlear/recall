import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { apiRouter } from "./server";

const hasDist = await Bun.file("dist/index.html").exists();

const app = hasDist
	? new Elysia()
			.use(apiRouter)
			.get("/", () => Bun.file("dist/index.html"))
			.use(staticPlugin({ assets: "dist", prefix: "/" }))
			.onError(({ code, set }) => {
				if (code === "NOT_FOUND") {
					set.status = 200;
					return Bun.file("dist/index.html");
				}
			})
	: new Elysia().use(apiRouter);

app.listen(3000);
console.log(`🦊 Elysia is running at http://localhost:3000`);
