import { db } from "@/server/db";
import { bookRequests } from "@/server/db/schema";
import { auth } from "@/server/lib/auth";
import Elysia, { t } from "elysia";

export const bookRequestsRouter = new Elysia({ prefix: "/api/book-requests", detail: { tags: ["Book Requests"] } })
  .post(
    "/",
    async ({ request, body, status }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) return status(401, { message: "Unauthorized" })
      const [bookRequest] = await db
        .insert(bookRequests)
        .values({ bookId: body.bookId, requestedBy: session.user.id, status: "submitted" })
        .returning();
      return bookRequest;
    },
    { body: t.Object({ bookId: t.String() }) }
  );
