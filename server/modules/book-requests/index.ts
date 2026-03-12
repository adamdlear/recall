import { auth, userIsAdmin } from "@/server/lib/auth";
import Elysia, { t } from "elysia";
import { BookRequestsService } from "./service";

export const bookRequestsRouter = new Elysia({ prefix: "/api/book-requests", detail: { tags: ["Book Requests"] } })
  .get(
    "/",
    async ({ request, status }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session || !userIsAdmin(session.user.role)) {
        return status(401, { message: "Unauthorized" })
      }
      return BookRequestsService.listRequests()
    }
  )
  .post(
    "/",
    async ({ request, body, status }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) return status(401, { message: "Unauthorized" })
      return BookRequestsService.submitRequest({ bookId: body.bookId, requestedBy: session.user.id })
    },
    { body: t.Object({ bookId: t.String() }) }
  )
  .patch(
    "/:id",
    async ({ request, params, body, status }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session || !userIsAdmin(session.user.role)) {
        return status(401, { message: "Unauthorized" })
      }
      return BookRequestsService.updateRequestStatus({ id: params.id, status: body.status })
    },
    {
      body: t.Object({
        status: t.Union([t.Literal("accepted"), t.Literal("denied"), t.Literal("under_review")]),
      }),
    }
  );
