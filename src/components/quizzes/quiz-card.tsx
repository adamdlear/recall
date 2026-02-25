"use client"

import { ArrowRight } from "lucide-react"
import { Badge } from "../ui/badge"
import { Quiz } from "@/server/modules/quizzes/model"

const difficultyColors: Record<string, string> = {
  Beginner: "bg-success/15 text-success border-success/20",
  Intermediate: "bg-chart-4/15 text-chart-4 border-chart-4/20",
  Advanced: "bg-destructive/15 text-destructive border-destructive/20",
}

export function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <a
      href={`/quiz/${quiz.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className="flex h-40 items-end p-5"
      // style={{ backgroundColor: quiz.coverColor }}
      >
        <h3 className="font-serif text-xl font-bold leading-tight text-white text-balance">
          {quiz.quizTitle}
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* <p className="text-sm font-medium text-muted-foreground"> */}
        {/*   {quiz.} */}
        {/* </p> */}
        <p className="text-sm leading-relaxed text-foreground/80">
          {quiz.quizDescription}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            {/* <Badge */}
            {/*   variant="outline" */}
            {/*   className={`text-xs font-medium ${difficultyColors[quiz.difficulty]}`} */}
            {/* > */}
            {/*   {quiz.difficulty} */}
            {/* </Badge> */}
            {/* <span className="text-xs text-muted-foreground"> */}
            {/*   {quiz.questionCount} questions */}
            {/* </span> */}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Start
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  )
}

