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
      isbn: "9780132350884",
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
                {
                  choiceText: "One thing, and do it well",
                  isCorrect: true,
                  explanation:
                    "Correct! A function that does one thing is easier to name, test, and reason about. Martin's Single Responsibility Principle applied to functions.",
                },
                {
                  choiceText: "Handle both happy path and error cases",
                  isCorrect: false,
                  explanation:
                    "Handling both happy and error paths means the function is doing at least two things. Martin actually says error handling itself is one thing — so a function that handles errors should do nothing else.",
                },
                {
                  choiceText: "Be no longer than 50 lines of code",
                  isCorrect: false,
                  explanation:
                    "Martin doesn't give a hard line limit. He says functions should be short enough to do one thing — often just a handful of lines, not 50.",
                },
                {
                  choiceText: "Accept no more than five parameters",
                  isCorrect: false,
                  explanation:
                    "Martin actually prefers zero parameters (niladic) and considers three or more a code smell. Five would be far too many by his standard.",
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
                  explanation:
                    "Correct! A flag argument announces the function does at least two things — one for true, one for false. Martin says to split such functions into two separately named functions instead.",
                },
                {
                  choiceText: "A mode switch — acceptable when well-named",
                  isCorrect: false,
                  explanation:
                    "Martin doesn't make exceptions for well-named boolean parameters. The problem isn't the naming — it's that the function is doing two things.",
                },
                {
                  choiceText: "A control variable — useful for polymorphism",
                  isCorrect: false,
                  explanation:
                    "If you need different behavior, Martin recommends splitting into two functions or using polymorphism at a higher level — not passing a boolean into a single function.",
                },
                {
                  choiceText: "A sentinel value — standard in functional code",
                  isCorrect: false,
                  explanation:
                    "Sentinel values signal end of data (like null or -1), not behavior switching. This is an unrelated concept.",
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
                  explanation:
                    "Correct! High-level functions appear first, calling lower-level helpers below them. A reader can follow the narrative from high to low abstraction without jumping around.",
                },
                {
                  choiceText: "Functions should call each other alphabetically",
                  isCorrect: false,
                  explanation:
                    "Alphabetical ordering has no bearing on readability or abstraction level. The stepdown rule is about abstraction hierarchy, not naming order.",
                },
                {
                  choiceText:
                    "Classes should be ordered from most to least public",
                  isCorrect: false,
                  explanation:
                    "The stepdown rule is about function ordering within a file — it's not a class-level concept.",
                },
                {
                  choiceText:
                    "Variable names should get shorter as their scope narrows",
                  isCorrect: false,
                  explanation:
                    "This is a separate naming convention idea — shorter names for tight scopes, longer for wider ones. Not the stepdown rule.",
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
                  explanation:
                    "Correct! Every argument adds cognitive overhead — readers must understand what it represents and how it interacts with the function. Zero arguments means nothing to juggle.",
                },
                {
                  choiceText: "One (monadic)",
                  isCorrect: false,
                  explanation:
                    "Monadic is good and often the natural minimum, but Martin says niladic (zero) is ideal. Monadic is the next best thing.",
                },
                {
                  choiceText: "Two (dyadic)",
                  isCorrect: false,
                  explanation:
                    "Dyadic functions require understanding the relationship between two arguments — Martin says they require more effort than monadic and should be avoided when possible.",
                },
                {
                  choiceText: "Three (triadic)",
                  isCorrect: false,
                  explanation:
                    "Triadic functions are significantly harder to understand and should be avoided when possible, according to Martin. Three is far from ideal.",
                },
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
                  explanation:
                    "Correct! A side effect is a secret second action. It couples the caller to hidden behavior and can introduce subtle bugs when the function is called in a different context or order.",
                },
                {
                  choiceText: "They make functions harder to name concisely",
                  isCorrect: false,
                  explanation:
                    "While true, this is a symptom. The deeper reason Martin gives is the violation of single responsibility and the hidden couplings they create.",
                },
                {
                  choiceText: "They prevent the use of dependency injection",
                  isCorrect: false,
                  explanation:
                    "Side effects and dependency injection are separate concerns. DI is about supplying dependencies at construction time — side effects are about hidden state changes during execution.",
                },
                {
                  choiceText: "They cause functions to exceed the 20-line limit",
                  isCorrect: false,
                  explanation:
                    "Martin doesn't set a 20-line limit, and side effects don't inherently increase function length. The problem is about behavior, not size.",
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
                  explanation:
                    "Correct! Martin's core idea: before writing a comment, ask whether you could have written the code so clearly that the comment became unnecessary.",
                },
                {
                  choiceText:
                    "The developer followed documentation best practices",
                  isCorrect: false,
                  explanation:
                    "Martin would argue the opposite — good code documents itself through naming and structure. Comments are often a sign of code that wasn't clear enough.",
                },
                {
                  choiceText:
                    "The code is particularly complex and needs explanation",
                  isCorrect: false,
                  explanation:
                    "Martin would push back on this — complexity is often a design smell that should be refactored away, not papered over with comments.",
                },
                {
                  choiceText: "The function requires unit tests",
                  isCorrect: false,
                  explanation:
                    "Test coverage is a separate concern. A function needing a comment isn't a signal about tests — it's a signal that the code itself should be clearer.",
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
                  choiceText:
                    "Legal comments and clarification of obscure library API intent",
                  isCorrect: true,
                  explanation:
                    "Correct! Martin accepts legal boilerplate (copyright, license) and comments explaining why a non-obvious third-party call is made a certain way — cases where the code itself can't convey the intent.",
                },
                {
                  choiceText:
                    "Redundant comments that restate what the code already says",
                  isCorrect: false,
                  explanation:
                    "Martin calls these 'noise comments' — they add clutter without adding understanding, and they can fall out of sync with the code over time.",
                },
                {
                  choiceText: "Commented-out code blocks",
                  isCorrect: false,
                  explanation:
                    "Martin is emphatic: never leave commented-out code. Source control remembers history — just delete it. Commented-out code rots and confuses future readers.",
                },
                {
                  choiceText: "Closing brace comments (// end if)",
                  isCorrect: false,
                  explanation:
                    "These are a sign that functions are too long. The fix is to shorten the function so closing braces are close to their openers — not to add comments.",
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
                  explanation:
                    "Correct! Error codes force callers to check them immediately, tangling error handling with business logic. Exceptions allow the happy path to stay clean and readable.",
                },
                {
                  choiceText:
                    "Prefer error codes — they are more explicit and performant",
                  isCorrect: false,
                  explanation:
                    "Martin explicitly rejects error codes — they are easy to ignore, pollute the calling code, and lead to deeply nested conditionals.",
                },
                {
                  choiceText:
                    "Either is fine as long as it is consistent within a module",
                  isCorrect: false,
                  explanation:
                    "Martin has a clear preference for exceptions. Consistency is valuable, but he wouldn't endorse error codes even if used consistently.",
                },
                {
                  choiceText: "Return null to signal errors from queries",
                  isCorrect: false,
                  explanation:
                    "Martin dedicates a whole section to why returning null is bad practice — it shifts null-checking burden to every caller and is a leading cause of NullPointerExceptions.",
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
                  explanation:
                    "Correct! Returning null silently propagates failure through the system. Martin recommends returning a Special Case object (Null Object pattern) or throwing an exception instead.",
                },
                {
                  choiceText:
                    "It is acceptable as a sentinel value for 'not found'",
                  isCorrect: false,
                  explanation:
                    "Martin explicitly argues against this. A Special Case object that behaves reasonably without null checks is the preferred alternative.",
                },
                {
                  choiceText:
                    "It is preferred over throwing exceptions for performance",
                  isCorrect: false,
                  explanation:
                    "Performance is not Martin's concern here — correctness and clarity are. Returning null fails on both counts by hiding errors.",
                },
                {
                  choiceText: "It should only be returned from void functions",
                  isCorrect: false,
                  explanation:
                    "Void functions don't return values at all — null is a separate concept. Martin argues against returning null from any function, not just certain kinds.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "The Pragmatic Programmer",
      isbn: "9780135957059",
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
                {
                  choiceText: "Don't Repeat Yourself",
                  isCorrect: true,
                  explanation:
                    "Correct! Every piece of knowledge must have a single, unambiguous, authoritative representation in a system. Duplication leads to contradictions and maintenance nightmares.",
                },
                {
                  choiceText: "Design Reusable Yardsticks",
                  isCorrect: false,
                  explanation:
                    "This is a plausible-sounding expansion but not what DRY means. DRY is about eliminating duplication of knowledge, not about measurement or design metrics.",
                },
                {
                  choiceText: "Develop Robust Yields",
                  isCorrect: false,
                  explanation:
                    "This isn't a real principle from the book. DRY is specifically about avoiding duplication so that a change in one place doesn't require changes in many others.",
                },
                {
                  choiceText: "Direct Reuse of Yielded code",
                  isCorrect: false,
                  explanation:
                    "DRY is about avoiding duplication of knowledge, which is broader than just code reuse. Two pieces of code that express the same concept independently violate DRY even if neither copies the other.",
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
                  explanation:
                    "Correct! Just as one unfixed broken window signals a building is abandoned — leading to more vandalism — one bad piece of code signals that quality doesn't matter, inviting more shortcuts.",
                },
                {
                  choiceText: "Never ship software with known defects",
                  isCorrect: false,
                  explanation:
                    "This describes a quality policy, not the Broken Window Theory. The theory is about the psychological effect of visible neglect on a team's behavior.",
                },
                {
                  choiceText: "Refactor code every time you add a feature",
                  isCorrect: false,
                  explanation:
                    "This describes the Boy Scout Rule (leave code cleaner than you found it) or continuous refactoring, which is related but distinct from the Broken Window Theory.",
                },
                {
                  choiceText: "All tests must pass before committing",
                  isCorrect: false,
                  explanation:
                    "This is a CI/CD practice. The Broken Window Theory is a social/psychological concept about how neglect spreads, not a testing rule.",
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
                  explanation:
                    "Correct! Orthogonal systems are easier to test, maintain, and extend because changes stay localized. The term comes from geometry — orthogonal lines are independent of each other.",
                },
                {
                  choiceText: "Code forms right-angle relationships in diagrams",
                  isCorrect: false,
                  explanation:
                    "This is the literal geometric meaning of 'orthogonal'. In software it's a metaphor for independence — not a visual or diagrammatic property.",
                },
                {
                  choiceText: "All modules share the same interface",
                  isCorrect: false,
                  explanation:
                    "Shared interfaces can actually create coupling, which is the opposite of orthogonality. Orthogonality means each component can change without affecting others.",
                },
                {
                  choiceText: "Variables must be declared before use",
                  isCorrect: false,
                  explanation:
                    "This is a language scoping rule in statically typed languages, completely unrelated to the architectural concept of orthogonality.",
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
                  explanation:
                    "Correct! Unlike a throwaway prototype, a tracer bullet is production code — lean but real — that lets you see immediately whether your architecture works end-to-end.",
                },
                {
                  choiceText: "A quick prototype that is discarded after a demo",
                  isCorrect: false,
                  explanation:
                    "This describes a throwaway prototype. A tracer bullet is the opposite — it's production code that's kept and built upon, not discarded.",
                },
                {
                  choiceText: "Writing tests before writing code",
                  isCorrect: false,
                  explanation:
                    "This describes Test-Driven Development (TDD). The Tracer Bullet is about building a thin slice of the full system to validate the architecture.",
                },
                {
                  choiceText:
                    "Deploying to production incrementally with feature flags",
                  isCorrect: false,
                  explanation:
                    "Feature flags are a deployment strategy for releasing to users gradually. A tracer bullet is an internal development technique for validating architecture, not a release strategy.",
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
                  explanation:
                    "Correct! If a wizard generates code you don't understand, you become dependent on it and can't debug or maintain the output. You must be able to read and own everything in your codebase.",
                },
                {
                  choiceText: "Writing overly clever or obfuscated code",
                  isCorrect: false,
                  explanation:
                    "Clever code is a separate anti-pattern. The Evil Wizard specifically targets the danger of using scaffolding tools that generate code you haven't understood.",
                },
                {
                  choiceText:
                    "Relying on magical thinking instead of testing",
                  isCorrect: false,
                  explanation:
                    "Magical thinking (assuming code works without verification) is a different anti-pattern. The Evil Wizard is specifically about code generation tools.",
                },
                {
                  choiceText:
                    "Using IDEs as a crutch instead of learning the language",
                  isCorrect: false,
                  explanation:
                    "IDE reliance is a related but distinct concern. The Evil Wizard specifically targets project scaffolding and code generators that produce code the developer doesn't own or understand.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Designing Data-Intensive Applications",
      isbn: "9781449373320",
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
                {
                  choiceText: "B-Trees",
                  isCorrect: true,
                  explanation:
                    "Correct! B-Trees keep keys sorted and support searches, sequential access, insertions, and deletions in O(log n) time — ideal properties for disk-based storage where random access is expensive.",
                },
                {
                  choiceText: "Hash maps",
                  isCorrect: false,
                  explanation:
                    "Hash maps are fast for exact key lookups but don't support range queries. Databases use them for in-memory hash indexes, not as the primary on-disk index.",
                },
                {
                  choiceText: "Skip lists",
                  isCorrect: false,
                  explanation:
                    "Skip lists are used in some in-memory databases (like Redis sorted sets) but are not the standard for disk-based relational database indexes.",
                },
                {
                  choiceText: "Bloom filters",
                  isCorrect: false,
                  explanation:
                    "Bloom filters are probabilistic structures used to quickly check if a key might exist — they're used alongside LSM-Trees to avoid unnecessary disk reads, not as primary indexes.",
                },
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
                  explanation:
                    "Correct! If the database crashes mid-write, the WAL lets it recover by replaying committed transactions that hadn't yet been applied to the main data structures.",
                },
                {
                  choiceText:
                    "Speeding up reads by caching recent query results",
                  isCorrect: false,
                  explanation:
                    "This describes a query cache or read buffer, not a WAL. The WAL is write-focused and about durability and crash recovery.",
                },
                {
                  choiceText: "Distributing writes across multiple replicas",
                  isCorrect: false,
                  explanation:
                    "While WALs can be shipped to replicas for logical replication, their primary purpose is local durability and crash recovery on a single node.",
                },
                {
                  choiceText: "Logging application events for debugging",
                  isCorrect: false,
                  explanation:
                    "Application logs and WALs are different things. A WAL is a structured binary log of storage operations, not human-readable application events.",
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
                  explanation:
                    "Correct! B-Trees update data in-place so reads find it quickly, but writes require random I/O. LSM-Trees batch writes sequentially (fast) but reads may need to check multiple levels (slower).",
                },
                {
                  choiceText:
                    "B-Trees are faster for writes; LSM-Trees are faster for reads",
                  isCorrect: false,
                  explanation:
                    "This is reversed. LSM-Trees excel at write-heavy workloads by converting random writes into sequential I/O through their log-structured design.",
                },
                {
                  choiceText:
                    "B-Trees use less memory; LSM-Trees use less disk space",
                  isCorrect: false,
                  explanation:
                    "LSM-Trees can have better storage efficiency due to compression in SSTables, but the central trade-off Kleppmann discusses is read vs. write performance, not memory usage.",
                },
                {
                  choiceText:
                    "B-Trees support ACID transactions; LSM-Trees do not",
                  isCorrect: false,
                  explanation:
                    "Both storage engines can support ACID transactions — the trade-off is a performance characteristic, not a transactional capability difference.",
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
                  explanation:
                    "Correct! Compaction repeatedly rewrites SSTables to merge levels and discard old versions. A single user write may be physically written to disk many times over its lifetime.",
                },
                {
                  choiceText: "The number of replicas each write must be sent to",
                  isCorrect: false,
                  explanation:
                    "Replication factor is a distributed systems concern. Write amplification is a storage engine phenomenon specific to the compaction process on a single node.",
                },
                {
                  choiceText:
                    "The overhead of writing to a WAL before the main store",
                  isCorrect: false,
                  explanation:
                    "WAL overhead is a real cost (roughly 2x writes), but write amplification specifically refers to the much larger multiplication caused by repeated compaction rewrites.",
                },
                {
                  choiceText:
                    "The multiplication of writes due to two-phase commit",
                  isCorrect: false,
                  explanation:
                    "Two-phase commit is a distributed transaction protocol. Write amplification is a storage engine phenomenon unrelated to distributed commit protocols.",
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
                  explanation:
                    "Correct! In practice, network partitions are unavoidable, so systems must choose between consistency (CP) and availability (AP) when a partition occurs.",
                },
                {
                  choiceText:
                    "Distributed systems must sacrifice performance for correctness",
                  isCorrect: false,
                  explanation:
                    "CAP doesn't mention performance at all. It's specifically about the trade-off between consistency, availability, and partition tolerance.",
                },
                {
                  choiceText:
                    "Any distributed system can achieve all three: Consistency, Availability, and Performance",
                  isCorrect: false,
                  explanation:
                    "This is the opposite of CAP. The theorem proves you cannot simultaneously guarantee all three of Consistency, Availability, and Partition tolerance.",
                },
                {
                  choiceText:
                    "Distributed systems cannot guarantee atomicity across nodes",
                  isCorrect: false,
                  explanation:
                    "CAP doesn't say this. Distributed transactions with two-phase commit can provide atomicity, though with trade-offs in availability.",
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
                  explanation:
                    "Correct! Eventual consistency is a weak guarantee — it says nothing about how long convergence takes or what you read in the interim. Stale reads are possible.",
                },
                {
                  choiceText: "All reads are guaranteed to see the latest write",
                  isCorrect: false,
                  explanation:
                    "This describes strong (linearizable) consistency — the opposite of eventual consistency. Eventual consistency explicitly allows stale reads.",
                },
                {
                  choiceText:
                    "Transactions are eventually committed but may be retried",
                  isCorrect: false,
                  explanation:
                    "This describes retry semantics in distributed transactions, not the consistency model called 'eventual consistency'.",
                },
                {
                  choiceText:
                    "Data is replicated to other data centers with a short delay",
                  isCorrect: false,
                  explanation:
                    "This describes asynchronous replication lag — a mechanism that can lead to eventual consistency, but not the definition of the consistency model itself.",
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
                  explanation:
                    "Correct! Replication lag means followers may serve stale reads. This is a key concern for 'read your own writes' and monotonic read consistency guarantees.",
                },
                {
                  choiceText: "The time taken to promote a follower to leader",
                  isCorrect: false,
                  explanation:
                    "Leader promotion (failover) is a separate concern from replication lag. Lag is about the ongoing propagation delay of writes during normal operation.",
                },
                {
                  choiceText: "Network latency between the client and the leader",
                  isCorrect: false,
                  explanation:
                    "Client-to-leader latency affects write performance but is not replication lag. Lag specifically describes the leader-to-follower propagation delay.",
                },
                {
                  choiceText: "The time to replay the WAL during crash recovery",
                  isCorrect: false,
                  explanation:
                    "WAL replay happens during crash recovery on a single node. Replication lag is about propagation to other nodes during normal operation.",
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
                  explanation:
                    "Correct! Split-brain is particularly dangerous because both leaders accept writes, causing divergent state that can be difficult or impossible to reconcile automatically.",
                },
                {
                  choiceText:
                    "A network partition where followers cannot reach the leader",
                  isCorrect: false,
                  explanation:
                    "A partition event can cause split-brain, but split-brain specifically refers to having two simultaneous leaders — not the partition itself.",
                },
                {
                  choiceText:
                    "A deadlock between two transactions competing for the same row",
                  isCorrect: false,
                  explanation:
                    "Deadlocks are a concurrency control problem within a single database node. Split-brain is a distributed systems problem about conflicting leadership.",
                },
                {
                  choiceText:
                    "Divergent query results returned from two read replicas",
                  isCorrect: false,
                  explanation:
                    "Read replicas returning different results is replication lag or stale reads — a normal consequence of eventual consistency. Split-brain specifically means two active leaders.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Structure and Interpretation of Computer Programs",
      isbn: "9780262510875",
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
                  explanation:
                    "Correct! Procedural abstraction lets you treat a procedure as a black box — you only need to know what it does, not how it does it. This is the foundation of modular programming.",
                },
                {
                  choiceText: "Converting all loops into recursive functions",
                  isCorrect: false,
                  explanation:
                    "While SICP uses recursion heavily, procedural abstraction is not about converting loops. It's about separating interface (what) from implementation (how).",
                },
                {
                  choiceText: "Using abstract data types instead of primitives",
                  isCorrect: false,
                  explanation:
                    "Abstract data types are data abstraction — a related but distinct concept. SICP explicitly distinguishes procedural abstraction from data abstraction.",
                },
                {
                  choiceText: "Generating code procedurally using macros",
                  isCorrect: false,
                  explanation:
                    "Macros are a meta-programming tool covered later in SICP. Procedural abstraction is a fundamental concept about hiding a procedure's internals from its callers.",
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
                  explanation:
                    "Correct! A recursive process grows in memory as it defers work to a call stack. An iterative process runs in constant space because all state lives in accumulator variables.",
                },
                {
                  choiceText:
                    "Recursive processes use function calls; iterative processes use loops",
                  isCorrect: false,
                  explanation:
                    "SICP makes the crucial point that a recursive procedure (syntactically) can generate an iterative process. The distinction is about the shape of the computation, not the syntax used.",
                },
                {
                  choiceText:
                    "Recursive processes are always less efficient in time and space",
                  isCorrect: false,
                  explanation:
                    "Tail-recursive procedures generate iterative processes that are equally efficient. Scheme's tail-call optimization is designed precisely to eliminate this penalty.",
                },
                {
                  choiceText:
                    "Iterative processes require mutable state; recursive ones do not",
                  isCorrect: false,
                  explanation:
                    "Iterative processes in SICP carry state through accumulator parameters — in a functional style this is achieved without mutation, passing updated values into each call.",
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
                  explanation:
                    "Correct! Higher-order procedures treat functions as first-class values, enabling powerful abstractions like map, filter, and fold that express general computational patterns.",
                },
                {
                  choiceText:
                    "A procedure that operates at a higher level of hardware abstraction",
                  isCorrect: false,
                  explanation:
                    "'Higher-order' is a mathematical/functional programming term about procedures as values. It has nothing to do with hardware abstraction levels.",
                },
                {
                  choiceText: "A procedure that calls itself more than once",
                  isCorrect: false,
                  explanation:
                    "A procedure calling itself multiple times (like tree recursion) is not higher-order. The defining characteristic is taking or returning other procedures.",
                },
                {
                  choiceText:
                    "A procedure that is defined inside the scope of another procedure",
                  isCorrect: false,
                  explanation:
                    "A procedure defined inside another is a local or nested procedure. It becomes higher-order only if it takes or returns procedures — nesting alone doesn't make it higher-order.",
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
                  explanation:
                    "Correct! Turing completeness means the language has sufficient expressive power to simulate any Turing machine — no computation is beyond its reach in theory.",
                },
                {
                  choiceText: "It supports an infinite loop construct",
                  isCorrect: false,
                  explanation:
                    "An infinite loop is necessary but not sufficient for Turing completeness. A language also needs conditional branching and the ability to manipulate arbitrary data.",
                },
                {
                  choiceText: "It has a formal proof of correctness",
                  isCorrect: false,
                  explanation:
                    "Formal verification is a separate field. Many Turing-complete languages have no formal proofs of correctness — and vice versa.",
                },
                {
                  choiceText:
                    "It can compile to machine code without an interpreter",
                  isCorrect: false,
                  explanation:
                    "Compilation is an implementation strategy, not a property of the language itself. Interpreted languages like Scheme are fully Turing complete.",
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
        isbn: bookData.isbn,
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
            explanation: c.explanation,
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
