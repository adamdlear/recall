"use client"

import { Book } from "@/server/modules/books/model"
import { ArrowRight } from "lucide-react"

export function BookCard({ book }: { book: Book }) {
  return (
    <a
      href={`/books/${book.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className="flex h-40 items-end p-5"
      >
        <h3 className="font-serif text-xl font-bold leading-tight text-balance">
          {book.title}
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-sm font-medium text-muted-foreground">
          {book.author}
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          {book.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Start
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  )
}

