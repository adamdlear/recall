import { db } from "@/server/db";
import { bookRequests, user } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export class BookRequestsService {
  static async listRequests() {
    return await db
      .select({
        id: bookRequests.id,
        bookId: bookRequests.bookId,
        status: bookRequests.status,
        createdAt: bookRequests.createdAt,
        updatedAt: bookRequests.updatedAt,
        requestedBy: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(bookRequests)
      .innerJoin(user, eq(bookRequests.requestedBy, user.id))
      .orderBy(desc(bookRequests.createdAt))
  }

  static async submitRequest({ bookId, requestedBy }: { bookId: string, requestedBy: string }) {
    const [bookRequest] = await db
      .insert(bookRequests)
      .values({ bookId, requestedBy, status: "submitted" })
      .returning()
    return bookRequest;
  }

  static async updateRequestStatus({ id, status }: { id: string, status: "accepted" | "denied" | "under_review" }) {
    const [updated] = await db
      .update(bookRequests)
      .set({ status })
      .where(eq(bookRequests.id, id))
      .returning()
    return updated;
  }
}
