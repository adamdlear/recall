import { db } from "@/server/db";
import { quizzes } from "@/server/db/schema/quizzes";
import { eq } from "drizzle-orm";

export class QuizzesService {
  static async listQuizzes() {
    return db.select().from(quizzes)
  }

  static async getQuizById(id: string) {
    return db.select().from(quizzes).where(eq(quizzes.id, id))
  }
}
