import { choices, questions, quizzes } from "@/server/db/schema"

export type Quiz = typeof quizzes.$inferSelect
export type Question = typeof questions.$inferSelect
export type Choice = typeof choices.$inferSelect
export type QuestionWithChoices = Question & { choices: Choice[] }
