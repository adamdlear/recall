import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { auth, OpenAPI } from './lib/auth';

const app = new Elysia()
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths()
			}
		})
	)
	.use(
		cors({
			origin: true,
			credentials: true
		})
	)
	.use(
		await staticPlugin({
			prefix: "/",
		}),
	)
	.mount(auth.handler)
	.get("/api/hello", () => ({
		message: "Hello from Elysia 🚀",
	}))
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);
