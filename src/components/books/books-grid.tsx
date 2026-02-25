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
    <div className="flex flex-col gap-10">
      {categories.map((category) => {
        const categoryBooks = books.filter((b) => b.category === category)
        return (
          <div key={category}>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-serif text-xl font-bold text-foreground">
                {category}
              </h2>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">
                {categoryBooks.length}{" "}
                {categoryBooks.length === 1 ? "book" : "books"}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
