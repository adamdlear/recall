import { QuizzesService } from "@/server/modules/quizzes/service";
import Elysia, { t } from "elysia";
import { BooksService } from "./service";

export const books = new Elysia({ prefix: "/api/books", detail: { tags: ["Books"] } })
  .get(
    "/",
    async ({ query }) => await BooksService.listBooks(query.q),
    { query: t.Optional(t.Object({ q: t.Optional(t.String()) })) }
  )
  .get(
    "/search/google",
    async ({ query: { q } }) => await BooksService.searchGoogleBooks(q),
    { query: t.Object({ q: t.Optional(t.String()) }) }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => await BooksService.getBookById(id),
    { params: t.Object({ id: t.String() }) }
  )
  .get(
    "/:id/cover",
    async ({ params: { id } }) => await BooksService.getBookCoverUrl(id),
    { params: t.Object({ id: t.String() }) }
  )
  .get(
    "/:id/quizzes",
    async ({ params: { id } }) => await QuizzesService.getQuizzesByBookId(id)
  )
