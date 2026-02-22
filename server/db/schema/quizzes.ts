import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizTitle: text("quiz_title").notNull(),
  quizDescription: text("quiz_description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
})

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  category: text("category").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const choices = pgTable("choices", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  choiceText: text("choice_text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
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
