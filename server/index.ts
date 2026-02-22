import { cors } from '@elysiajs/cors';
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { auth } from './modules/auth';
import { quizzes } from './modules/quizzes';

const app = new Elysia()
	.use(
		cors({
			origin: true,
			credentials: true
		})
	)
	.use(
		await staticPlugin(),
	)
	.use(auth)
	.use(quizzes)
	.get("/api/hello", () => ({
		message: "Hello from Elysia 🚀",
	}))
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
