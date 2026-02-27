import { auth } from "@/server/lib/auth"
import Elysia, { t } from "elysia"
import { QuizSessionsService } from "./service"

export const quizSessionsRouter = new Elysia({ prefix: "/api/quiz-sessions" })
  .get(
    "/",
    async ({ request, query, status }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) return status(401, { message: "Unauthorized" })
      const quizSession = await QuizSessionsService.getInProgressSession(session.user.id, query.quizId)
      return quizSession ?? null
    },
    { query: t.Object({ quizId: t.String() }) },
  )
  .post(
    "/",
    async ({ request, body, status }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) return status(401, { message: "Unauthorized" })
      return QuizSessionsService.createSession(session.user.id, body.quizId)
    },
    { body: t.Object({ quizId: t.String() }) },
  )
  .get("/:id", async ({ request, params: { id }, status }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return status(401, { message: "Unauthorized" })
    const quizSession = await QuizSessionsService.getSession(id, session.user.id)
    if (!quizSession) return status(404, { message: "Not found" })
    return quizSession
  })
  .post(
    "/:id/answer",
    async ({ request, params: { id }, body, status }) => {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session) return status(401, { message: "Unauthorized" })
      try {
        return await QuizSessionsService.submitAnswer(id, session.user.id, body.questionId, body.choiceId)
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error"
        return status(400, { message })
      }
    },
    { body: t.Object({ questionId: t.String(), choiceId: t.String() }) },
  )
