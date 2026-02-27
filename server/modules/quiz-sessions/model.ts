import type { quizSessions } from "@/server/db/schema"

export type QuizSession = typeof quizSessions.$inferSelect

export interface SessionAnswer {
  questionId: string
  choiceId: string
  isCorrect: boolean
}
