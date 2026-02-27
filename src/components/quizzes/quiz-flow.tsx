import { useState, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
} from "lucide-react"
import type { Book } from "@/server/modules/books/model"
import type { Quiz, QuestionWithChoices } from "@/server/modules/quizzes/model"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { cn, bookColor } from "@/src/lib/utils"

interface UserAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
}

type QuizPhase = "intro" | "question" | "feedback" | "results"

export function QuizFlow({
  book,
  quiz,
  questions,
}: {
  book: Book | null | undefined
  quiz: Quiz
  questions: QuestionWithChoices[]
}) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<QuizPhase>("intro")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<UserAnswer[]>([])

  const question = questions[currentIndex]
  const totalQuestions = questions.length
  const progressValue =
    phase === "results"
      ? 100
      : phase === "intro"
        ? 0
        : ((currentIndex + (phase === "feedback" ? 1 : 0)) / totalQuestions) * 100

  const score = answers.filter((a) => a.isCorrect).length
  const percentage = Math.round((score / totalQuestions) * 100)
  const bookDetailUrl = `/books/${book?.id}`

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (phase !== "question") return
      setSelectedOption(optionIndex)
    },
    [phase],
  )

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || !question) return
    const correctIndex = question.choices.findIndex((c) => c.isCorrect)
    const isCorrect = selectedOption === correctIndex
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        selectedAnswer: selectedOption,
        isCorrect,
      },
    ])
    setPhase("feedback")
  }, [selectedOption, question])

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setPhase("question")
    } else {
      setPhase("results")
    }
  }, [currentIndex, totalQuestions])

  const handleRestart = useCallback(() => {
    setPhase("intro")
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers([])
  }, [])

  // Intro screen
  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-16 text-center">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-2xl"
          style={{ backgroundColor: book ? bookColor(book.title) : undefined }}
        >
          <BookOpen className="h-12 w-12 text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {quiz.category}
          </p>
          <h1 className="font-serif text-3xl font-black tracking-tight text-foreground text-balance">
            {quiz.title}
          </h1>
          {book && (
            <p className="text-base text-muted-foreground">
              {book.title} by {book.author}
            </p>
          )}
        </div>
        <p className="max-w-md text-sm leading-relaxed text-foreground/70">
          {quiz.description} This quiz contains{" "}
          <strong>{totalQuestions} questions</strong> to test and deepen your understanding.
        </p>
        <div className="flex items-center gap-3">
          <Button size="lg" className="gap-2" onClick={() => setPhase("question")}>
            Start Quiz
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate({ to: bookDetailUrl })}>
            <ArrowLeft className="h-4 w-4" />
            Back to Book
          </Button>
        </div>
      </div>
    )
  }

  // Results screen
  if (phase === "results") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full",
              percentage >= 80
                ? "bg-success/15"
                : percentage >= 50
                  ? "bg-chart-4/15"
                  : "bg-destructive/15",
            )}
          >
            <span
              className={cn(
                "text-3xl font-black",
                percentage >= 80
                  ? "text-success"
                  : percentage >= 50
                    ? "text-chart-4"
                    : "text-destructive",
              )}
            >
              {percentage}%
            </span>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {percentage >= 80
                ? "Excellent Work!"
                : percentage >= 50
                  ? "Good Effort!"
                  : "Keep Learning!"}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              You got <strong>{score}</strong> out of{" "}
              <strong>{totalQuestions}</strong> questions correct on{" "}
              <strong>
                {quiz.category}: {quiz.title}
              </strong>
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleRestart} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
            <Button onClick={() => navigate({ to: bookDetailUrl })} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Book
            </Button>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="mt-10 flex flex-col gap-5">
          <h3 className="font-serif text-lg font-bold text-foreground">Review Your Answers</h3>
          {questions.map((q, index) => {
            const userAnswer = answers[index]
            const isCorrect = userAnswer?.isCorrect
            const correctIndex = q.choices.findIndex((c) => c.isCorrect)
            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-xl border p-5",
                  isCorrect
                    ? "border-success/20 bg-success/5"
                    : "border-destructive/20 bg-destructive/5",
                )}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  )}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold leading-snug text-foreground">
                      {q.questionText}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your answer:{" "}
                      <span
                        className={cn(
                          "font-medium",
                          isCorrect ? "text-success" : "text-destructive",
                        )}
                      >
                        {q.choices[userAnswer?.selectedAnswer ?? 0]?.choiceText}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-muted-foreground">
                        Correct answer:{" "}
                        <span className="font-medium text-success">
                          {q.choices[correctIndex]?.choiceText}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Question + Feedback screen
  if (!question) return null

  const correctIndex = question.choices.findIndex((c) => c.isCorrect)
  const isCorrect = phase === "feedback" ? selectedOption === correctIndex : null

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* Progress header */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-muted-foreground">{Math.round(progressValue)}% complete</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="font-serif text-xl font-bold leading-snug text-foreground text-pretty">
          {question.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.choices.map((choice, index) => {
          const letter = String.fromCharCode(65 + index)
          let optionStyle = ""

          if (phase === "feedback") {
            if (index === correctIndex) {
              optionStyle = "border-success bg-success/10 ring-1 ring-success/30"
            } else if (index === selectedOption && index !== correctIndex) {
              optionStyle = "border-destructive bg-destructive/10 ring-1 ring-destructive/30"
            } else {
              optionStyle = "border-border bg-muted/30 opacity-60"
            }
          } else if (index === selectedOption) {
            optionStyle = "border-primary bg-primary/5 ring-1 ring-primary/30"
          } else {
            optionStyle =
              "border-border bg-card hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelectOption(index)}
              disabled={phase === "feedback"}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                optionStyle,
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                  phase === "feedback" && index === correctIndex
                    ? "bg-success text-success-foreground"
                    : phase === "feedback" &&
                      index === selectedOption &&
                      index !== correctIndex
                      ? "bg-destructive text-white"
                      : index === selectedOption
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                )}
              >
                {phase === "feedback" && index === correctIndex ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : phase === "feedback" &&
                  index === selectedOption &&
                  index !== correctIndex ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  letter
                )}
              </span>
              <span className="text-sm font-medium leading-snug text-foreground">
                {choice.choiceText}
              </span>
            </button>
          )
        })}
      </div>

      {/* Feedback Panel */}
      {phase === "feedback" && (
        <div
          className={cn(
            "mt-6 rounded-xl border p-5",
            isCorrect
              ? "border-success/20 bg-success/5"
              : "border-destructive/20 bg-destructive/5",
          )}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            )}
            <div className="flex flex-col gap-1.5">
              <p
                className={cn(
                  "text-sm font-bold",
                  isCorrect ? "text-success" : "text-destructive",
                )}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              {selectedOption !== null && question.choices[selectedOption]?.explanation && (
                <p className="text-sm leading-relaxed text-foreground/80">
                  {question.choices[selectedOption].explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex justify-end">
        {phase === "question" ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="gap-2"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-2">
            {currentIndex < totalQuestions - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              "View Results"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
