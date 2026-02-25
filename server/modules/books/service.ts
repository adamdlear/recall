import { db } from "@/server/db";
import { books } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export class BooksService {
  static async listBooks() {
    return await db.select().from(books);
  }

  static async getBookById(id: string) {
    const results = await db.select().from(books).where(eq(books.id, id)).limit(1);
    return results[0];
  }
}

