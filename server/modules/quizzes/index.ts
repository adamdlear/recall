import Elysia from "elysia";
import { QuizzesService } from "./service";

export const quizzes = new Elysia({ prefix: "/api/quizzes" })
	.get("/", QuizzesService.listQuizzes)
	.get("/:id", ({ params: { id } }) => QuizzesService.getQuizById(id))
	.get("/:id/questions", ({ params: { id } }) => QuizzesService.getQuestionsByQuizId(id));
