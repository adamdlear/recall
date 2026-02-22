import { db } from "./index";
import { questions, choices, quizzes } from "./schema/quizzes"; // Import quizzes table
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database with quiz data...");

  // Clear existing data in reverse order of dependency
  await db.delete(choices);
  await db.delete(questions);
  await db.delete(quizzes); // Clear quizzes table first
  console.log("Cleared existing quiz and question data.");

  const quizData = [
    {
      quizTitle: "To Kill a Mockingbird",
      quizDescription: "A quiz on Harper Lee's classic novel.",
      questions: [
        {
          questionText: "Who wrote \"To Kill a Mockingbird\"?",
          category: "Author",
          difficulty: "easy",
          choices: [
            { choiceText: "Harper Lee", isCorrect: true },
            { choiceText: "F. Scott Fitzgerald", isCorrect: false },
            { choiceText: "Ernest Hemingway", isCorrect: false },
            { choiceText: "Jane Austen", isCorrect: false },
          ],
        },
        {
          questionText: "What is the name of the lawyer who defends Tom Robinson?",
          category: "Characters",
          difficulty: "medium",
          choices: [
            { choiceText: "Bob Ewell", isCorrect: false },
            { choiceText: "Atticus Finch", isCorrect: true },
            { choiceText: "Sheriff Tate", isCorrect: false },
            { choiceText: "Scout Finch", isCorrect: false },
          ],
        },
        {
          questionText: "What does Scout learn about Boo Radley throughout the novel?",
          category: "Plot",
          difficulty: "medium",
          choices: [
            { choiceText: "He is a dangerous criminal.", isCorrect: false },
            { choiceText: "He is a recluse who is kind and protective.", isCorrect: true },
            { choiceText: "He is secretly the mayor of Maycomb.", isCorrect: false },
            { choiceText: "He moved away at the beginning of the story.", isCorrect: false },
          ],
        },
      ],
    },
    {
      quizTitle: "1984",
      quizDescription: "Test your knowledge of George Orwell's dystopian masterpiece.",
      questions: [
        {
          questionText: "In George Orwell's \"1984\", what is the name of the totalitarian ruling party?",
          category: "Politics",
          difficulty: "medium",
          choices: [
            { choiceText: "The Brotherhood", isCorrect: false },
            { choiceText: "The Party", isCorrect: true },
            { choiceText: "The Collective", isCorrect: false },
            { choiceText: "The Regime", isCorrect: false },
          ],
        },
        {
          questionText: "What is the purpose of 'Newspeak'?",
          category: "Language",
          difficulty: "hard",
          choices: [
            { choiceText: "To make communication more efficient.", isCorrect: false },
            { choiceText: "To expand the vocabulary of Oceania.", isCorrect: false },
            { choiceText: "To limit freedom of thought by limiting language.", isCorrect: true },
            { choiceText: "To translate ancient texts into modern English.", isCorrect: false },
          ],
        },
        {
          questionText: "Who is the main protagonist of the novel?",
          category: "Characters",
          difficulty: "easy",
          choices: [
            { choiceText: "O'Brien", isCorrect: false },
            { choiceText: "Big Brother", isCorrect: false },
            { choiceText: "Emmanuel Goldstein", isCorrect: false },
            { choiceText: "Winston Smith", isCorrect: true },
          ],
        },
      ],
    },
    {
      quizTitle: "The Chronicles of Narnia",
      quizDescription: "A quiz covering C.S. Lewis's magical world of Narnia.",
      questions: [
        {
          questionText: "Which of these is NOT one of the Pevensie children in C.S. Lewis's \"The Chronicles of Narnia\"?",
          category: "Characters",
          difficulty: "medium",
          choices: [
            { choiceText: "Peter", isCorrect: false },
            { choiceText: "Susan", isCorrect: false },
            { choiceText: "Eustace", isCorrect: true },
            { choiceText: "Lucy", isCorrect: false },
          ],
        },
        {
          questionText: "What is the name of the lion who is the true king of Narnia?",
          category: "Characters",
          difficulty: "easy",
          choices: [
            { choiceText: "Reepicheep", isCorrect: false },
            { choiceText: "Aslan", isCorrect: true },
            { choiceText: "Mr. Tumnus", isCorrect: false },
            { choiceText: "Cair Paravel", isCorrect: false },
          ],
        },
        {
          questionText: "Through which object do the Pevensie children first enter Narnia?",
          category: "Setting",
          difficulty: "easy",
          choices: [
            { choiceText: "A magical wardrobe", isCorrect: true },
            { choiceText: "A hidden door in a tree", isCorrect: false },
            { choiceText: "An old painting", isCorrect: false },
            { choiceText: "A secret passage in a castle", isCorrect: false },
          ],
        },
      ],
    },
    {
      quizTitle: "Harry Potter Series",
      quizDescription: "Test your knowledge of the wizarding world created by J.K. Rowling.",
      questions: [
        {
          questionText: "What is the primary setting for most of the Harry Potter series?",
          category: "Setting",
          difficulty: "easy",
          choices: [
            { choiceText: "Diagon Alley", isCorrect: false },
            { choiceText: "The Burrow", isCorrect: false },
            { choiceText: "Hogwarts School of Witchcraft and Wizardry", isCorrect: true },
            { choiceText: "Privet Drive", isCorrect: false },
          ],
        },
        {
          questionText: "What is the name of the magical object that allows wizards to travel between designated fireplaces?",
          category: "Magic Items",
          difficulty: "medium",
          choices: [
            { choiceText: "The Marauder's Map", isCorrect: false },
            { choiceText: "The Goblet of Fire", isCorrect: false },
            { choiceText: "The Floo Network", isCorrect: true },
            { choiceText: "The Time-Turner", isCorrect: false },
          ],
        },
        {
          questionText: "Who is the Half-Blood Prince?",
          category: "Characters",
          difficulty: "medium",
          choices: [
            { choiceText: "Albus Dumbledore", isCorrect: false },
            { choiceText: "Severus Snape", isCorrect: true },
            { choiceText: "Tom Riddle", isCorrect: false },
            { choiceText: "Harry Potter", isCorrect: false },
          ],
        },
      ],
    },
    {
      quizTitle: "Moby Dick",
      quizDescription: "Questions about Herman Melville's epic tale of Captain Ahab and the white whale.",
      questions: [
        {
          questionText: "Which classic novel features a white whale named Moby Dick?",
          category: "Literature",
          difficulty: "easy",
          choices: [
            { choiceText: "Twenty Thousand Leagues Under the Seas", isCorrect: false },
            { choiceText: "The Old Man and the Sea", isCorrect: false },
            { choiceText: "Moby Dick", isCorrect: true },
            { choiceText: "Typee", isCorrect: false },
          ],
        },
        {
          questionText: "What is the name of the ship on which Captain Ahab obsessively hunts Moby Dick?",
          category: "Plot",
          difficulty: "medium",
          choices: [
            { choiceText: "The Pequod", isCorrect: true },
            { choiceText: "The Rachel", isCorrect: false },
            { choiceText: "The Nautilus", isCorrect: false },
            { choiceText: "The Beagle", isCorrect: false },
          ],
        },
        {
          questionText: "Who is the narrator of \"Moby Dick\"?",
          category: "Characters",
          difficulty: "medium",
          choices: [
            { choiceText: "Captain Ahab", isCorrect: false },
            { choiceText: "Ishmael", isCorrect: true },
            { choiceText: "Queequeg", isCorrect: false },
            { choiceText: "Starbuck", isCorrect: false },
          ],
        },
      ],
    },
  ];

  for (const quiz of quizData) {
    const [insertedQuiz] = await db.insert(quizzes).values({
      id: crypto.randomUUID(),
      quizTitle: quiz.quizTitle,
      quizDescription: quiz.quizDescription,
    }).returning({ id: quizzes.id });

    if (insertedQuiz) {
      for (const q of quiz.questions) {
        const [insertedQuestion] = await db.insert(questions).values({
          id: crypto.randomUUID(),
          quizId: insertedQuiz.id, // Link question to the current quiz
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
    }
  }

  console.log("Quiz data seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed quiz data:", err);
  process.exit(1);
});
