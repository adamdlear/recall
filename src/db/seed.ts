import { db } from "./index";
import { questions, choices } from "./schema/quizzes";


async function seed() {
  console.log("Seeding database with quiz data...");

  // Clear existing quiz data to prevent duplicates on re-seed
  await db.delete(choices);
  await db.delete(questions);
  console.log("Cleared existing quiz data.");

  const bookQuestions = [
    {
      questionText: "Who wrote \"To Kill a Mockingbird\"?",
      category: "Literature",
      difficulty: "easy",
      choices: [
        { choiceText: "Harper Lee", isCorrect: true },
        { choiceText: "F. Scott Fitzgerald", isCorrect: false },
        { choiceText: "Ernest Hemingway", isCorrect: false },
        { choiceText: "Jane Austen", isCorrect: false },
      ],
    },
    {
      questionText: "In George Orwell's \"1984\", what is the name of the totalitarian ruling party?",
      category: "Dystopian Fiction",
      difficulty: "medium",
      choices: [
        { choiceText: "The Brotherhood", isCorrect: false },
        { choiceText: "The Party", isCorrect: true },
        { choiceText: "The Collective", isCorrect: false },
        { choiceText: "The Regime", isCorrect: false },
      ],
    },
    {
      questionText: "Which of these is NOT one of the Pevensie children in C.S. Lewis's \"The Chronicles of Narnia\"?",
      category: "Fantasy",
      difficulty: "medium",
      choices: [
        { choiceText: "Peter", isCorrect: false },
        { choiceText: "Susan", isCorrect: false },
        { choiceText: "Eustace", isCorrect: true },
        { choiceText: "Lucy", isCorrect: false },
      ],
    },
    {
      questionText: "What is the primary setting for most of the Harry Potter series?",
      category: "Fantasy",
      difficulty: "easy",
      choices: [
        { choiceText: "Diagon Alley", isCorrect: false },
        { choiceText: "The Burrow", isCorrect: false },
        { choiceText: "Hogwarts School of Witchcraft and Wizardry", isCorrect: true },
        { choiceText: "Privet Drive", isCorrect: false },
      ],
    },
    {
      questionText: "Which classic novel features a white whale named Moby Dick?",
      category: "Adventure",
      difficulty: "easy",
      choices: [
        { choiceText: "Twenty Thousand Leagues Under the Seas", isCorrect: false },
        { choiceText: "The Old Man and the Sea", isCorrect: false },
        { choiceText: "Moby Dick", isCorrect: true },
        { choiceText: "Typee", isCorrect: false },
      ],
    },
  ];

  for (const q of bookQuestions) {
    const [insertedQuestion] = await db.insert(questions).values({
      id: crypto.randomUUID(),
      questionText: q.questionText,
      category: q.category,
      difficulty: q.difficulty,
    }).returning({ id: questions.id });

    if (insertedQuestion) {
      const choicesToInsert = q.choices.map((c) => ({
        id: crypto.randomUUID(),
        questionId: insertedQuestion.id,
        choiceText: c.choiceText,
        isCorrect: c.isCorrect,
      }));
      await db.insert(choices).values(choicesToInsert);
    }
  }

  console.log("Quiz data seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed quiz data:", err);
  process.exit(1);
});
