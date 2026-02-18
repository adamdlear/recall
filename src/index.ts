import { cors } from '@elysiajs/cors';
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { authService } from './services/auth-service';

const app = new Elysia()
	.use(
		cors({
			origin: true,
			credentials: true
		})
	)
	.use(authService)
	.use(
		await staticPlugin(),
	)
	.get("/api/hello", () => ({
		message: "Hello from Elysia 🚀",
	}))
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);
