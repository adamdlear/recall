import { db } from "@/server/db"
import { choices, quizSessions } from "@/server/db/schema"
import { and, eq } from "drizzle-orm"
import { QuizzesService } from "../quizzes/service"
import type { QuizSession, SessionAnswer } from "./model"

export class QuizSessionsService {
  static async createSession(userId: string, quizId: string): Promise<QuizSession> {
    const questions = await QuizzesService.getQuestionsByQuizId(quizId)
    const questionOrder = questions.map((q) => q.id)

    const results = await db
      .insert(quizSessions)
      .values({
        userId,
        quizId,
        questionOrder,
        answers: [],
        status: "in_progress",
      })
      .returning()

    return results[0]
  }

  static async getSession(id: string, userId: string): Promise<QuizSession | undefined> {
    const results = await db
      .select()
      .from(quizSessions)
      .where(and(eq(quizSessions.id, id), eq(quizSessions.userId, userId)))
      .limit(1)

    return results[0]
  }

  static async getInProgressSession(userId: string, quizId: string): Promise<QuizSession | undefined> {
    const results = await db
      .select()
      .from(quizSessions)
      .where(
        and(
          eq(quizSessions.userId, userId),
          eq(quizSessions.quizId, quizId),
          eq(quizSessions.status, "in_progress"),
        ),
      )
      .limit(1)

    return results[0]
  }

  static async submitAnswer(
    sessionId: string,
    userId: string,
    questionId: string,
    choiceId: string,
  ): Promise<QuizSession> {
    const session = await QuizSessionsService.getSession(sessionId, userId)

    if (!session) {
      throw new Error("Session not found")
    }
    if (session.status !== "in_progress") {
      throw new Error("Session is already completed")
    }

    const answers = session.answers as SessionAnswer[]
    const questionOrder = session.questionOrder as string[]
    const expectedQuestionId = questionOrder[answers.length]

    if (questionId !== expectedQuestionId) {
      throw new Error("Question is not the next expected question")
    }

    const choiceResults = await db
      .select({ isCorrect: choices.isCorrect })
      .from(choices)
      .where(eq(choices.id, choiceId))
      .limit(1)

    if (!choiceResults[0]) {
      throw new Error("Choice not found")
    }

    const isCorrect = choiceResults[0].isCorrect
    const newAnswers: SessionAnswer[] = [...answers, { questionId, choiceId, isCorrect }]
    const isCompleted = newAnswers.length === questionOrder.length

    const updated = await db
      .update(quizSessions)
      .set({
        answers: newAnswers,
        status: isCompleted ? "completed" : "in_progress",
        completedAt: isCompleted ? new Date() : undefined,
      })
      .where(eq(quizSessions.id, sessionId))
      .returning()

    return updated[0]
  }
}
