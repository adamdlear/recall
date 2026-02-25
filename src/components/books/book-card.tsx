"use client"

import { Book } from "@/server/modules/books/model"
import { bookColor } from '@/src/lib/utils'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from "lucide-react"

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      to="/books/$id"
      params={{ id: book.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className="relative flex h-40 items-end overflow-hidden p-5"
        style={{ backgroundColor: bookColor(book.title) }}
      >
        {book.coverUrl && (
          <>
            <img
              src={book.coverUrl}
              alt={book.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
        <h3 className="relative font-serif text-xl font-bold leading-tight text-white text-balance">
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
    </Link>
  )
}

