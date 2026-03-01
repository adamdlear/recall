import Elysia, { t } from "elysia";
import { BooksService } from "./service";
import { QuizzesService } from "@/server/modules/quizzes/service";

export const books = new Elysia({ prefix: "/api/books" })
  .get("/", async ({ query }) => await BooksService.listBooks(query.q), { query: t.Optional(t.Object({ q: t.Optional(t.String()) })) })
  .get("/:id", async ({ params: { id } }) => await BooksService.getBookById(id), { params: t.Object({ id: t.String() }) })
  .get("/:id/cover", async ({ params: { id } }) => await BooksService.getBookCoverUrl(id), { params: t.Object({ id: t.String() }) })
  .get("/:id/quizzes", async ({ params: { id } }) => await QuizzesService.getQuizzesByBookId(id))

