import { quizzes } from "@/server/db/schema/quizzes"

export type Quiz = typeof quizzes.$inferSelect
