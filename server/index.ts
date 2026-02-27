import { cors } from "@elysiajs/cors";
import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { OpenAPI, auth } from "./lib/auth";
import { books } from "./modules/books";
import { quizSessionsRouter } from "./modules/quiz-sessions";
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
	.get("/api/auth/*", ({ request }) => auth.handler(request))
	.post("/api/auth/*", ({ request }) => auth.handler(request))
	.use(books)
	.use(quizzes)
	.use(quizSessionsRouter);

export { app as apiRouter };
export type App = typeof app;
