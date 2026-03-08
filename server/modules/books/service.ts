import { db } from "@/server/db";
import { books } from "@/server/db/schema";
import { getBookCoverUrl, GoogleBook, searchBooks } from "@/server/lib/google-books-client";
import { eq, ilike, or } from "drizzle-orm";
import { Book } from "./model";

export class BooksService {
  static async listBooks(query?: string): Promise<Book[]> {
    if (!query) {
      return await db.select().from(books);
    }
    return await db
      .select()
      .from(books)
      .where(or(ilike(books.title, `%${query}%`), ilike(books.author, `%${query}%`)))
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
    const coverUrl = await getBookCoverUrl(book.isbn)
    return { coverUrl };
  }

  static async searchGoogleBooks(q?: string): Promise<GoogleBook[]> {
    if (!q) {
      return []
    }
    return await searchBooks({ q: `${q} subject:computers` })
  }
}

