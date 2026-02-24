import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { OpenAPI } from "./lib/auth";
import { auth } from "./modules/auth";
import { quizzes } from "./modules/quizzes";

const app = new Elysia()
	.use(
		cors({
			origin: true,
			credentials: true,
		}),
	)
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	.use(auth)
	.use(quizzes)
	.get("/api/hello", () => ({
		message: "Hello from Elysia 🚀",
	}));

export { app as apiRouter };
export type App = typeof app;
