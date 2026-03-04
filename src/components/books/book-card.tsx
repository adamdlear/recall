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
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_24px_-4px] hover:shadow-primary/15"
    >
      {/* Color bar */}
      <div
        className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: bookColor(book.title) }}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-snug text-foreground text-balance">
            {book.title}
          </h3>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 translate-x-0 text-muted-foreground/30 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
        </div>

        {/* Author */}
        <p className="font-mono text-xs text-muted-foreground">
          {book.author}
        </p>

        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {book.description}
        </p>
      </div>
    </Link>
  )
}

