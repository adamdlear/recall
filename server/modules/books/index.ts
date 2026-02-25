import Elysia from "elysia";
import { BooksService } from "./service";

export const books = new Elysia({ prefix: "/api/books" })
  .get("/", BooksService.listBooks)
  .get("/:id", ({ params: { id } }) => BooksService.getBookById(id));

