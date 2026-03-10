import { useMutation, useQuery } from "@tanstack/react-query"
import { ExternalLink, BookOpen, BookMarked, Check, Loader2 } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { app } from "@/src/lib/api"
import { authClient } from "@/src/lib/auth-client"
import { bookColor } from "@/src/lib/utils"

type GoogleBook = {
  googleId: string
  title: string
  author: string
  description: string
  coverUrl: string | null
  categories: string[]
  publishedDate: string | null
}

function RequestQuizButton({ googleId }: { googleId: string }) {
  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const res = await app.api["book-requests"].post({ bookId: googleId })
      return res.data
    },
  })

  if (sessionLoading) return null

  if (!session) {
    return (
      <Link
        to="/login"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <BookMarked className="h-3.5 w-3.5" />
        Sign in to request
      </Link>
    )
  }

  if (isSuccess) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
        <Check className="h-3.5 w-3.5" />
        Requested
      </span>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        mutate()
      }}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <BookMarked className="h-3.5 w-3.5" />
      )}
      Request quiz
    </button>
  )
}

function GoogleBookCard({ book }: { book: GoogleBook }) {
  return (
    <a
      href={`https://books.google.com/books?id=${book.googleId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_24px_-4px] hover:shadow-primary/15"
    >
      {/* Color bar */}
      <div
        className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: bookColor(book.title) }}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-snug text-foreground text-balance">
            {book.title}
          </h3>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 opacity-0 transition-all duration-200 group-hover:text-primary group-hover:opacity-100" />
        </div>

        <p className="font-mono text-xs text-muted-foreground">{book.author}</p>

        {book.description && (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {book.description}
          </p>
        )}

        <div className="mt-auto pt-1">
          <RequestQuizButton googleId={book.googleId} />
        </div>
      </div>
    </a>
  )
}

type GoogleBooksSearchProps = {
  query: string
}

export function GoogleBooksSearch({ query }: GoogleBooksSearchProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["google-books", query],
    queryFn: async () => {
      const res = await app.api.books.search.google.get({ query: { q: query } })
      return res.data
    },
    enabled: !!query,
  })

  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <div className="mb-8 flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Google Books
          </span>
          <div className="h-px flex-1 bg-border/60" />
          <span className="font-mono text-xs text-muted-foreground">
            not in our library yet
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No results found on Google Books for &ldquo;{query}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((book) => (
              <GoogleBookCard key={book.googleId} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
