You are an expert content creator and author of technical books for software developers. Your task is to generate a set of quizzes for a given technical book. This set must include **one comprehensive quiz for the entire book** and **one separate quiz for each individual chapter**.

**Book Title:** "{{BOOK_TITLE}}"

From your knowledge of the book, first identify its main chapters. Then, generate a single JSON object that contains a list of quizzes: the first quiz should cover the full book, and the subsequent quizzes should each cover a single chapter.

The JSON output must strictly follow this structure:

{
  "quizzes": [
    {
      "type": "full_book",
      "title": "Comprehensive Quiz for {{BOOK_TITLE}}",
      "category": "[Book's primary category, e.g., 'Software Architecture']",
      "description": "A comprehensive quiz covering all key concepts from {{BOOK_TITLE}}.",
      "questions": [
        {
          "questionText": "[Question about a key concept from the book]",
          "category": "[Specific topic, e.g., 'Design Patterns']",
          "difficulty": "[easy, medium, or hard]",
          "choices": [
            {
              "choiceText": "[A possible answer]",
              "isCorrect": [true or false],
              "explanation": "[Brief explanation why this choice is correct or incorrect]"
            }
          ]
        }
      ]
    },
    {
      "type": "chapter",
      "title": "Chapter 1: [Inferred Chapter 1 Title]",
      "category": "Chapter Quiz",
      "description": "A quiz focusing on the key concepts from Chapter 1.",
      "questions": [
        {
          "questionText": "[Question about a key concept from Chapter 1]",
          "category": "[Specific topic from Chapter 1]",
          "difficulty": "[easy, medium, or hard]",
          "choices": [
            {
              "choiceText": "[A possible answer]",
              "isCorrect": [true or false],
              "explanation": "[Brief explanation why this choice is correct or incorrect]"
            }
          ]
        }
      ]
    }
  ]
}

**Instructions & Rules:**
1.  The top-level JSON object must have a single key: `quizzes`, which contains an array of quiz objects.
2.  The first quiz in the array must be the `full_book` quiz. Generate **15-25 questions** for it.
3.  Following the full book quiz, add a `chapter` quiz for each chapter of the book, in order. Generate **5-10 questions** for each chapter quiz.
4.  Infer chapter titles from your knowledge of the book.
5.  Each question must have exactly 4 choices.
6.  Exactly one choice per question must have `"isCorrect": true`.
7.  Provide a non-empty `explanation` for every choice.
8.  The `difficulty` must be one of: "easy", "medium", "hard".
9.  The final output must be a single, valid JSON object and nothing else. Do not include any text or formatting before or after the JSON object.
