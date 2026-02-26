import { db } from "@/server/db";
import { choices, questions, quizzes } from "@/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import type { QuestionWithChoices } from "./model";

export class QuizzesService {
	static async listQuizzes() {
		return await db.select().from(quizzes);
	}

	static async getQuizById(id: string) {
		const results = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
		return results[0];
	}

	static async getQuizzesByBookId(bookId: string) {
		return await db.select().from(quizzes).where(eq(quizzes.bookId, bookId));
	}

	static async getQuestionsByQuizId(quizId: string): Promise<QuestionWithChoices[]> {
		const qs = await db.select().from(questions).where(eq(questions.quizId, quizId));
		if (qs.length === 0) return [];
		const questionIds = qs.map((q) => q.id);
		const cs = await db.select().from(choices).where(inArray(choices.questionId, questionIds));
		return qs.map((q) => ({
			...q,
			choices: cs.filter((c) => c.questionId === q.id),
		}));
	}
}
