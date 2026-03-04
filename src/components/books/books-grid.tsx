import { Book } from "@/server/modules/books/model"
import { BookCard } from "./book-card"

type BooksGridProps = {
  books: Book[] | null | undefined
  isLoading: boolean
}

export function BooksGrid({ books, isLoading }: BooksGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-5">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-48 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!books) return null

  const categories = [...new Set(books.map((b) => b.category))]

  return (
    <div className="flex flex-col gap-12">
      {categories.map((category) => {
        const categoryBooks = books.filter((b) => b.category === category)
        return (
          <div key={category}>
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                {category}
              </span>
              <div className="h-px flex-1 bg-border/60" />
              <span className="font-mono text-xs text-muted-foreground">
                {categoryBooks.length}{" "}
                {categoryBooks.length === 1 ? "book" : "books"}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
