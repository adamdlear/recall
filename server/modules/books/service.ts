import { db } from "@/server/db";
import { books } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Book } from "./model";

export class BooksService {
  static async listBooks(query?: string): Promise<Book[]> {
    if (!query) {
      return await db.select().from(books);
    }
    const titleResults = await db.select().from(books).where(eq(books.title, query))
    const authorResults = await db.select().from(books).where(eq(books.author, query))
    return [...titleResults, ...authorResults]
  }

  static async getBookById(id: string) {
    const results = await db.select().from(books).where(eq(books.id, id)).limit(1);
    return results[0];
  }

  static async getBookCoverUrl(id: string): Promise<{ coverUrl: string | null }> {
    const results = await db.select({ isbn: books.isbn, coverUrl: books.coverUrl }).from(books).where(eq(books.id, id)).limit(1);
    const book = results[0];
    if (!book) return { coverUrl: null };
    if (book.coverUrl) return { coverUrl: book.coverUrl };
    if (!book.isbn) return { coverUrl: null };

    const url = new URL("https://www.googleapis.com/books/v1/volumes");
    url.searchParams.set("q", `isbn:${book.isbn}`);
    url.searchParams.set("fields", "items/volumeInfo/imageLinks");
    if (process.env.GOOGLE_BOOKS_API_KEY) url.searchParams.set("key", process.env.GOOGLE_BOOKS_API_KEY);

    const res = await fetch(url.toString());
    const data = await res.json();
    const thumbnail: string | undefined = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (!thumbnail) return { coverUrl: null };

    const coverUrl = thumbnail.replace("http://", "https://").replace("zoom=1", "zoom=0");
    return { coverUrl };
  }
}

