import { db } from "@/server/db";
import { books, quizzes, questions, choices } from "@/server/db/schema";

async function seed() {
  console.log("Seeding database with technical book quiz data...");

  // Clear in reverse dependency order (questions/choices cascade from quizzes)
  await db.delete(choices);
  await db.delete(questions);
  await db.delete(quizzes);
  await db.delete(books);
  console.log("Cleared existing data.");

  const seedData = [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Software Engineering",
      description:
        "A handbook of agile software craftsmanship covering principles, patterns, and practices for writing clean, readable, and maintainable code.",
      quizzes: [
        {
          title: "Meaningful Names & Functions",
          category: "Clean Code Fundamentals",
          description:
            "Test your understanding of naming conventions and function design from Clean Code chapters 2–3.",
          questions: [
            {
              questionText:
                "According to Clean Code, what should a well-designed function ideally do?",
              category: "Functions",
              difficulty: "easy" as const,
              choices: [
                { choiceText: "One thing, and do it well", isCorrect: true },
                {
                  choiceText: "Handle both happy path and error cases",
                  isCorrect: false,
                },
                {
                  choiceText: "Be no longer than 50 lines of code",
                  isCorrect: false,
                },
                {
                  choiceText: "Accept no more than five parameters",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What does Martin call a boolean parameter passed to a function to control its behavior?",
              category: "Functions",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "A flag argument — a terrible practice that should be avoided",
                  isCorrect: true,
                },
                {
                  choiceText: "A mode switch — acceptable when well-named",
                  isCorrect: false,
                },
                {
                  choiceText: "A control variable — useful for polymorphism",
                  isCorrect: false,
                },
                {
                  choiceText: "A sentinel value — standard in functional code",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What is the 'stepdown rule' (or newspaper metaphor applied to functions) in Clean Code?",
              category: "Functions",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "Code should read top-to-bottom with decreasing levels of abstraction",
                  isCorrect: true,
                },
                {
                  choiceText: "Functions should call each other alphabetically",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Classes should be ordered from most to least public",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Variable names should get shorter as their scope narrows",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "In Clean Code, what is the ideal number of arguments (arity) for a function?",
              category: "Functions",
              difficulty: "easy" as const,
              choices: [
                {
                  choiceText: "Zero (niladic) — fewest arguments is best",
                  isCorrect: true,
                },
                { choiceText: "One (monadic)", isCorrect: false },
                { choiceText: "Two (dyadic)", isCorrect: false },
                { choiceText: "Three (triadic)", isCorrect: false },
              ],
            },
            {
              questionText:
                "Why does Martin argue that side effects in functions are dangerous?",
              category: "Functions",
              difficulty: "hard" as const,
              choices: [
                {
                  choiceText:
                    "They create hidden temporal couplings and violate the principle of doing one thing",
                  isCorrect: true,
                },
                {
                  choiceText: "They make functions harder to name concisely",
                  isCorrect: false,
                },
                {
                  choiceText: "They prevent the use of dependency injection",
                  isCorrect: false,
                },
                {
                  choiceText: "They cause functions to exceed the 20-line limit",
                  isCorrect: false,
                },
              ],
            },
          ],
        },
        {
          title: "Comments, Formatting & Error Handling",
          category: "Clean Code Fundamentals",
          description:
            "Questions on when to write comments, how to format code for readability, and proper error handling practices.",
          questions: [
            {
              questionText:
                "According to Clean Code, what does the presence of a comment often indicate?",
              category: "Comments",
              difficulty: "easy" as const,
              choices: [
                {
                  choiceText:
                    "A failure to express intent clearly in the code itself",
                  isCorrect: true,
                },
                {
                  choiceText: "The developer followed documentation best practices",
                  isCorrect: false,
                },
                {
                  choiceText: "The code is particularly complex and needs explanation",
                  isCorrect: false,
                },
                {
                  choiceText: "The function requires unit tests",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "Which type of comment does Martin consider acceptable in Clean Code?",
              category: "Comments",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText: "Legal comments and clarification of obscure library API intent",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "Redundant comments that restate what the code already says",
                  isCorrect: false,
                },
                { choiceText: "Commented-out code blocks", isCorrect: false },
                {
                  choiceText: "Closing brace comments (// end if)",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What does Martin say about using exceptions vs. returning error codes?",
              category: "Error Handling",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "Prefer exceptions — they separate error handling logic from the happy path",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "Prefer error codes — they are more explicit and performant",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Either is fine as long as it is consistent within a module",
                  isCorrect: false,
                },
                {
                  choiceText: "Return null to signal errors from queries",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What does Martin say about returning null from a function?",
              category: "Error Handling",
              difficulty: "hard" as const,
              choices: [
                {
                  choiceText:
                    "It is bad practice — it forces callers to check for null and invites NullPointerExceptions",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "It is acceptable as a sentinel value for 'not found'",
                  isCorrect: false,
                },
                {
                  choiceText: "It is preferred over throwing exceptions for performance",
                  isCorrect: false,
                },
                {
                  choiceText: "It should only be returned from void functions",
                  isCorrect: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      category: "Software Engineering",
      description:
        "Timeless advice for software developers covering pragmatic philosophy, tools, and habits to become a more effective programmer.",
      quizzes: [
        {
          title: "Core Pragmatic Philosophy",
          category: "Developer Mindset",
          description:
            "Questions on the foundational principles and philosophy from The Pragmatic Programmer.",
          questions: [
            {
              questionText: "What does the DRY principle stand for?",
              category: "Principles",
              difficulty: "easy" as const,
              choices: [
                { choiceText: "Don't Repeat Yourself", isCorrect: true },
                { choiceText: "Design Reusable Yardsticks", isCorrect: false },
                { choiceText: "Develop Robust Yields", isCorrect: false },
                {
                  choiceText: "Direct Reuse of Yielded code",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What is the 'Broken Window Theory' as applied to software in The Pragmatic Programmer?",
              category: "Principles",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "Neglected code quality leads to more neglect and accelerating deterioration",
                  isCorrect: true,
                },
                {
                  choiceText: "Never ship software with known defects",
                  isCorrect: false,
                },
                {
                  choiceText: "Refactor code every time you add a feature",
                  isCorrect: false,
                },
                {
                  choiceText: "All tests must pass before committing",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What does 'Orthogonality' mean in the context of software design in The Pragmatic Programmer?",
              category: "Design",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "Components are independent — a change in one does not ripple into others",
                  isCorrect: true,
                },
                {
                  choiceText: "Code forms right-angle relationships in diagrams",
                  isCorrect: false,
                },
                {
                  choiceText: "All modules share the same interface",
                  isCorrect: false,
                },
                {
                  choiceText: "Variables must be declared before use",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What is a 'Tracer Bullet' approach to development?",
              category: "Methodology",
              difficulty: "hard" as const,
              choices: [
                {
                  choiceText:
                    "An end-to-end skeleton that actually runs, used to validate architecture early",
                  isCorrect: true,
                },
                {
                  choiceText: "A quick prototype that is discarded after a demo",
                  isCorrect: false,
                },
                { choiceText: "Writing tests before writing code", isCorrect: false },
                {
                  choiceText: "Deploying to production incrementally with feature flags",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What does the 'Evil Wizard' analogy warn against in The Pragmatic Programmer?",
              category: "Tools",
              difficulty: "hard" as const,
              choices: [
                {
                  choiceText:
                    "Using code generators or wizards without understanding the code they produce",
                  isCorrect: true,
                },
                {
                  choiceText: "Writing overly clever or obfuscated code",
                  isCorrect: false,
                },
                {
                  choiceText: "Relying on magical thinking instead of testing",
                  isCorrect: false,
                },
                {
                  choiceText: "Using IDEs as a crutch instead of learning the language",
                  isCorrect: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      category: "Systems Design",
      description:
        "A comprehensive guide to the principles, tools, and techniques behind reliable, scalable, and maintainable data systems.",
      quizzes: [
        {
          title: "Storage Engines & Indexing",
          category: "Database Internals",
          description:
            "Questions on how databases store and retrieve data, covering B-Trees, LSM-Trees, and related concepts.",
          questions: [
            {
              questionText:
                "What data structure do most traditional relational databases use as their primary on-disk index?",
              category: "Indexes",
              difficulty: "easy" as const,
              choices: [
                { choiceText: "B-Trees", isCorrect: true },
                { choiceText: "Hash maps", isCorrect: false },
                { choiceText: "Skip lists", isCorrect: false },
                { choiceText: "Bloom filters", isCorrect: false },
              ],
            },
            {
              questionText:
                "What is a Write-Ahead Log (WAL) primarily used for in a database?",
              category: "Durability",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "Ensuring durability by recording changes before applying them to the main storage",
                  isCorrect: true,
                },
                {
                  choiceText: "Speeding up reads by caching recent query results",
                  isCorrect: false,
                },
                {
                  choiceText: "Distributing writes across multiple replicas",
                  isCorrect: false,
                },
                {
                  choiceText: "Logging application events for debugging",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What is the primary read/write trade-off between B-Trees and LSM-Trees?",
              category: "Storage Engines",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "B-Trees are faster for reads; LSM-Trees are typically faster for writes",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "B-Trees are faster for writes; LSM-Trees are faster for reads",
                  isCorrect: false,
                },
                {
                  choiceText: "B-Trees use less memory; LSM-Trees use less disk space",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "B-Trees support ACID transactions; LSM-Trees do not",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What does 'write amplification' refer to in the context of LSM-Trees?",
              category: "Storage Engines",
              difficulty: "hard" as const,
              choices: [
                {
                  choiceText:
                    "One logical write causing multiple physical writes due to compaction",
                  isCorrect: true,
                },
                {
                  choiceText: "The number of replicas each write must be sent to",
                  isCorrect: false,
                },
                {
                  choiceText: "The overhead of writing to a WAL before the main store",
                  isCorrect: false,
                },
                {
                  choiceText: "The multiplication of writes due to two-phase commit",
                  isCorrect: false,
                },
              ],
            },
          ],
        },
        {
          title: "Replication & Distributed Consensus",
          category: "Distributed Systems",
          description:
            "Questions on replication strategies, consistency guarantees, and consensus in distributed data systems.",
          questions: [
            {
              questionText: "What does the CAP theorem state?",
              category: "Consistency",
              difficulty: "easy" as const,
              choices: [
                {
                  choiceText:
                    "A distributed system can guarantee at most two of: Consistency, Availability, and Partition tolerance",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "Distributed systems must sacrifice performance for correctness",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Any distributed system can achieve all three: Consistency, Availability, and Performance",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Distributed systems cannot guarantee atomicity across nodes",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText: "What does 'eventual consistency' mean?",
              category: "Consistency",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "Given no new updates, all replicas will eventually converge to the same value",
                  isCorrect: true,
                },
                {
                  choiceText: "All reads are guaranteed to see the latest write",
                  isCorrect: false,
                },
                {
                  choiceText: "Transactions are eventually committed but may be retried",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Data is replicated to other data centers with a short delay",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "In leader-based replication, what is 'replication lag'?",
              category: "Replication",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "The delay between a write being committed on the leader and appearing on followers",
                  isCorrect: true,
                },
                {
                  choiceText: "The time taken to promote a follower to leader",
                  isCorrect: false,
                },
                {
                  choiceText: "Network latency between the client and the leader",
                  isCorrect: false,
                },
                {
                  choiceText: "The time to replay the WAL during crash recovery",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What problem does the 'split-brain' scenario describe in distributed systems?",
              category: "Consensus",
              difficulty: "hard" as const,
              choices: [
                {
                  choiceText:
                    "Two nodes both believe they are the leader simultaneously, risking conflicting writes",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "A network partition where followers cannot reach the leader",
                  isCorrect: false,
                },
                {
                  choiceText: "A deadlock between two transactions competing for the same row",
                  isCorrect: false,
                },
                {
                  choiceText: "Divergent query results returned from two read replicas",
                  isCorrect: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Structure and Interpretation of Computer Programs",
      author: "Harold Abelson & Gerald Jay Sussman",
      category: "Computer Science",
      description:
        "A foundational computer science textbook that teaches programming through the lens of abstraction, using Scheme to explore recursion, interpreters, and computational thinking.",
      quizzes: [
        {
          title: "Procedures, Recursion & Abstraction",
          category: "Functional Programming",
          description:
            "Questions on procedural abstraction, recursive vs. iterative processes, and higher-order procedures from SICP.",
          questions: [
            {
              questionText:
                "What is 'procedural abstraction' as described in SICP?",
              category: "Abstraction",
              difficulty: "easy" as const,
              choices: [
                {
                  choiceText:
                    "Hiding the implementation of a procedure behind its name and interface",
                  isCorrect: true,
                },
                {
                  choiceText: "Converting all loops into recursive functions",
                  isCorrect: false,
                },
                {
                  choiceText: "Using abstract data types instead of primitives",
                  isCorrect: false,
                },
                {
                  choiceText: "Generating code procedurally using macros",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "In SICP, what is the key difference between a recursive process and an iterative process?",
              category: "Recursion",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "A recursive process builds up deferred operations; an iterative process maintains state in a fixed set of variables",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "Recursive processes use function calls; iterative processes use loops",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Recursive processes are always less efficient in time and space",
                  isCorrect: false,
                },
                {
                  choiceText:
                    "Iterative processes require mutable state; recursive ones do not",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText: "What is a 'higher-order procedure' in SICP?",
              category: "Higher-Order Functions",
              difficulty: "medium" as const,
              choices: [
                {
                  choiceText:
                    "A procedure that takes other procedures as arguments or returns a procedure as its value",
                  isCorrect: true,
                },
                {
                  choiceText:
                    "A procedure that operates at a higher level of hardware abstraction",
                  isCorrect: false,
                },
                { choiceText: "A procedure that calls itself more than once", isCorrect: false },
                {
                  choiceText:
                    "A procedure that is defined inside the scope of another procedure",
                  isCorrect: false,
                },
              ],
            },
            {
              questionText:
                "What does SICP mean by a language being 'Turing complete'?",
              category: "Computation",
              difficulty: "hard" as const,
              choices: [
                {
                  choiceText:
                    "It can express any computation that any other Turing-complete language can",
                  isCorrect: true,
                },
                {
                  choiceText: "It supports an infinite loop construct",
                  isCorrect: false,
                },
                {
                  choiceText: "It has a formal proof of correctness",
                  isCorrect: false,
                },
                {
                  choiceText: "It can compile to machine code without an interpreter",
                  isCorrect: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  for (const bookData of seedData) {
    const [insertedBook] = await db
      .insert(books)
      .values({
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        description: bookData.description,
      })
      .returning({ id: books.id });

    if (!insertedBook) continue;

    for (const quizData of bookData.quizzes) {
      const [insertedQuiz] = await db
        .insert(quizzes)
        .values({
          bookId: insertedBook.id,
          title: quizData.title,
          category: quizData.category,
          description: quizData.description,
        })
        .returning({ id: quizzes.id });

      if (!insertedQuiz) continue;

      for (const q of quizData.questions) {
        const [insertedQuestion] = await db
          .insert(questions)
          .values({
            quizId: insertedQuiz.id,
            questionText: q.questionText,
            category: q.category,
            difficulty: q.difficulty,
          })
          .returning({ id: questions.id });

        if (!insertedQuestion) continue;

        await db.insert(choices).values(
          q.choices.map((c) => ({
            questionId: insertedQuestion.id,
            choiceText: c.choiceText,
            isCorrect: c.isCorrect,
          }))
        );
      }
    }

    console.log(`Seeded book: "${bookData.title}"`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed database:", err);
  process.exit(1);
});
