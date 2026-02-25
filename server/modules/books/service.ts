import { db } from "@/server/db";
import { books } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export class BooksService {
  static async listBooks() {
    return await db.select().from(books);
  }

  static async getBookById(id: string) {
    return await db.select().from(books).where(eq(books.id, id));
  }
}

