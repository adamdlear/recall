import type { Book } from "@/server/modules/books/model"
import type { SessionAnswer } from "@/server/modules/quiz-sessions/model"
import type { QuestionWithChoices, Quiz } from "@/server/modules/quizzes/model"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { app } from "@/src/lib/api"
import { authClient } from "@/src/lib/auth-client"
import { cn } from "@/src/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Terminal,
  XCircle,
  Zap,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

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
  const queryClient = useQueryClient()
  const { data: authSession } = authClient.useSession()

  const [phase, setPhase] = useState<QuizPhase>("intro")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const { data: quizSession } = useQuery({
    queryKey: ["quiz-session", sessionId],
    queryFn: async () => {
      const res = await app.api["quiz-sessions"]({ id: sessionId! }).get()
      return res.data
    },
    enabled: sessionId !== null,
  })

  const { data: existingSession } = useQuery({
    queryKey: ["quiz-session-active", quiz.id],
    queryFn: async () => {
      const res = await app.api["quiz-sessions"].get({ query: { quizId: quiz.id } })
      return res.data ?? null
    },
    enabled: !!authSession && sessionId === null,
  })

  useEffect(() => {
    if (!existingSession) return
    const answers = existingSession.answers as SessionAnswer[]
    queryClient.setQueryData(["quiz-session", existingSession.id], existingSession)
    setSessionId(existingSession.id)
    setCurrentIndex(answers.length)
    setPhase(existingSession.status === "completed" ? "results" : "question")
  }, [existingSession, queryClient])

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await app.api["quiz-sessions"].post({ quizId: quiz.id })
      if (res.error) throw new Error(res.error.value?.message ?? "Failed to create session")
      return res.data!
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["quiz-session", data.id], data)
      setSessionId(data.id)
      setPhase("question")
    },
  })

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, choiceId }: { questionId: string; choiceId: string }) => {
      const res = await app.api["quiz-sessions"]({ id: sessionId! }).answer.post({ questionId, choiceId })
      if (res.error) throw new Error(res.error.value?.message ?? "Failed to submit answer")
      return res.data!
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["quiz-session", sessionId], data)
      setPhase("feedback")
    },
  })

  const orderedQuestions = quizSession
    ? (quizSession.questionOrder as string[]).map((id) => questions.find((q) => q.id === id)!).filter(Boolean)
    : questions

  const question = orderedQuestions[currentIndex]
  const totalQuestions = orderedQuestions.length
  const progressValue =
    phase === "results"
      ? 100
      : phase === "intro"
        ? 0
        : ((currentIndex + (phase === "feedback" ? 1 : 0)) / totalQuestions) * 100

  const sessionAnswers = (quizSession?.answers ?? []) as SessionAnswer[]
  const score = sessionAnswers.filter((a) => a.isCorrect).length
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
    const choiceId = question.choices[selectedOption]?.id
    if (!choiceId) return
    submitAnswerMutation.mutate({ questionId: question.id, choiceId })
  }, [selectedOption, question, submitAnswerMutation])

  const handleNext = useCallback(() => {
    if (quizSession?.status === "completed") {
      setPhase("results")
    } else if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setPhase("question")
    }
  }, [quizSession, currentIndex, totalQuestions])

  const handleRestart = useCallback(() => {
    setPhase("intro")
    setCurrentIndex(0)
    setSelectedOption(null)
    setSessionId(null)
  }, [])

  const handleStartQuiz = useCallback(() => {
    if (!authSession) {
      navigate({ to: "/login" })
      return
    }
    createSessionMutation.mutate()
  }, [authSession, createSessionMutation, navigate])

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-14 md:py-20">
        {/* Back link */}
        <button
          onClick={() => navigate({ to: bookDetailUrl })}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground w-fit"
        >
          <ArrowLeft className="h-3 w-3" />
          {book?.title ?? "back"}
        </button>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            {quiz.category}
          </span>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl text-balance">
            {quiz.title}
          </h1>
          {book && (
            <p className="font-mono text-xs text-muted-foreground">
              {book.title} · {book.author}
            </p>
          )}
        </div>

        {/* Description card */}
        <div className="rounded-lg border border-border/60 bg-card p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {quiz.description}
          </p>
          <div className="mt-4 flex items-center gap-4 border-t border-border/40 pt-4">
            <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              {totalQuestions} questions
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
              Explanation after every answer
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            className="gap-2 font-mono text-sm"
            onClick={handleStartQuiz}
            disabled={createSessionMutation.isPending}
          >
            <Zap className="h-4 w-4" />
            Start Quiz
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="font-mono text-sm"
            onClick={() => navigate({ to: bookDetailUrl })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === "results") {
    const scoreColor =
      percentage >= 80
        ? "text-emerald-400"
        : percentage >= 50
          ? "text-amber-400"
          : "text-rose-400"
    const scoreBorder =
      percentage >= 80
        ? "border-emerald-400/30 bg-emerald-400/5"
        : percentage >= 50
          ? "border-amber-400/30 bg-amber-400/5"
          : "border-rose-400/30 bg-rose-400/5"
    const scoreLabel =
      percentage >= 80 ? "Excellent" : percentage >= 50 ? "Good effort" : "Keep grinding"

    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* Score card */}
        <div className={cn("rounded-lg border p-8 text-center mb-8", scoreBorder)}>
          <div className={cn("font-mono text-6xl font-black tabular-nums", scoreColor)}>
            {percentage}%
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">{scoreLabel}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {score} / {totalQuestions} correct · {quiz.category}: {quiz.title}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" className="gap-2 font-mono text-sm" onClick={handleRestart}>
              <RotateCcw className="h-3.5 w-3.5" />
              Retake
            </Button>
            <Button className="gap-2 font-mono text-sm" onClick={() => navigate({ to: bookDetailUrl })}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to book
            </Button>
          </div>
        </div>

        {/* Review */}
        <div className="mb-3">
          <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            Review
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          {orderedQuestions.map((q) => {
            const userAnswer = sessionAnswers.find((a) => a.questionId === q.id)
            const isCorrect = userAnswer?.isCorrect
            const selectedChoice = q.choices.find((c) => c.id === userAnswer?.choiceId)
            const correctChoice = q.choices.find((c) => c.isCorrect)
            const explanation = selectedChoice?.explanation ?? correctChoice?.explanation
            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-lg border p-4",
                  isCorrect
                    ? "border-emerald-400/20 bg-emerald-400/5"
                    : "border-rose-400/20 bg-rose-400/5",
                )}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  )}
                  <div className="flex flex-col gap-2 min-w-0">
                    <p className="text-sm font-semibold leading-snug text-foreground">
                      {q.questionText}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Your answer:{" "}
                      <span className={cn("font-bold", isCorrect ? "text-emerald-400" : "text-rose-400")}>
                        {selectedChoice?.choiceText}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="font-mono text-xs text-muted-foreground">
                        Correct:{" "}
                        <span className="font-bold text-emerald-400">
                          {correctChoice?.choiceText}
                        </span>
                      </p>
                    )}
                    {explanation && (
                      <div className="mt-1 flex items-start gap-2 rounded-md border border-border/40 bg-background/60 p-3">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {explanation}
                        </p>
                      </div>
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

  // ── Question + Feedback ────────────────────────────────────────────────────
  if (!question) return null

  const correctIndex = question.choices.findIndex((c) => c.isCorrect)
  const isCorrect = phase === "feedback" ? selectedOption === correctIndex : null

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* Progress header */}
      <div className="mb-8 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {quiz.category} · {quiz.title}
          </span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <Progress value={progressValue} className="h-1" />
      </div>

      {/* Question */}
      <div className="mb-7">
        <div className="mb-3 font-mono text-xs font-bold text-primary uppercase tracking-widest">
          Question {currentIndex + 1}
        </div>
        <h2 className="text-lg font-semibold leading-snug text-foreground text-pretty">
          {question.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.choices.map((choice, index) => {
          const letter = String.fromCharCode(65 + index)
          const isThisCorrect = index === correctIndex
          const isThisSelected = index === selectedOption
          const isThisWrong = phase === "feedback" && isThisSelected && !isThisCorrect

          const containerStyle = cn(
            "flex items-center gap-4 rounded-lg border p-4 text-left transition-all duration-150",
            phase === "feedback"
              ? isThisCorrect
                ? "border-emerald-400/40 bg-emerald-400/10"
                : isThisWrong
                  ? "border-rose-400/40 bg-rose-400/10"
                  : "border-border/30 bg-muted/20 opacity-50"
              : isThisSelected
                ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
          )

          const keyStyle = cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-xs font-bold transition-colors",
            phase === "feedback"
              ? isThisCorrect
                ? "bg-emerald-400 text-background"
                : isThisWrong
                  ? "bg-rose-400 text-background"
                  : "bg-muted text-muted-foreground"
              : isThisSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
          )

          return (
            <button
              key={choice.id}
              onClick={() => handleSelectOption(index)}
              disabled={phase === "feedback"}
              className={containerStyle}
            >
              <span className={keyStyle}>
                {phase === "feedback" && isThisCorrect ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : phase === "feedback" && isThisWrong ? (
                  <XCircle className="h-3.5 w-3.5" />
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

      {/* Feedback panel */}
      {phase === "feedback" && (
        <div
          className={cn(
            "mt-5 rounded-lg border p-4",
            isCorrect
              ? "border-emerald-400/25 bg-emerald-400/10"
              : "border-rose-400/25 bg-rose-400/10",
          )}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            )}
            <div>
              <p className={cn("font-mono text-xs font-bold mb-1.5", isCorrect ? "text-emerald-400" : "text-rose-400")}>
                {isCorrect ? "Correct" : "Incorrect"}
              </p>
              {selectedOption !== null && question.choices[selectedOption]?.explanation && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {question.choices[selectedOption].explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: bookDetailUrl })}
          className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← quit
        </button>
        {phase === "question" ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null || submitAnswerMutation.isPending}
            className="gap-2 font-mono text-sm"
          >
            Submit
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-2 font-mono text-sm">
            {quizSession?.status === "completed" || currentIndex >= totalQuestions - 1
              ? "See results"
              : "Next"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
