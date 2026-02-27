import { relations } from "drizzle-orm";
import { account, books, choices, questions, quizSessions, quizzes, session, user } from "./schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  quizSessions: many(quizSessions),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const booksRelations = relations(books, ({ many }) => ({
  quizzes: many(quizzes),
}))

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  quizSessions: many(quizSessions),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  choices: many(choices),
}));

export const choicesRelations = relations(choices, ({ one }) => ({
  question: one(questions, {
    fields: [choices.questionId],
    references: [questions.id],
  }),
}));

export const quizSessionsRelations = relations(quizSessions, ({ one }) => ({
  user: one(user, {
    fields: [quizSessions.userId],
    references: [user.id],
  }),
  quiz: one(quizzes, {
    fields: [quizSessions.quizId],
    references: [quizzes.id],
  }),
}));

