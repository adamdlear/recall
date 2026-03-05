import { app } from '@/src/lib/api'
import { bookColor } from '@/src/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Layers, Zap } from 'lucide-react'

export const Route = createFileRoute('/books/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await app.api.books({ id }).get()
      return res.data
    }
  })

  const { data: quizzes } = useQuery({
    queryKey: ["book-quizzes", id],
    queryFn: async () => {
      const res = await app.api.books({ id }).quizzes.get()
      return res.data
    },
  })

  const quiz = quizzes?.[0]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          <div className="h-4 w-24 animate-pulse rounded bg-muted-foreground/20 mb-8" />
          <div className="rounded-lg border border-border/60 bg-card mb-8 p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="h-3 w-20 animate-pulse rounded bg-muted-foreground/20" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted-foreground/20" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted-foreground/20" />
              <div className="h-16 w-full animate-pulse rounded bg-muted-foreground/20" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-3 w-3" />
            library
          </Link>
          <div className="rounded-lg border border-border/60 bg-card p-6 md:p-8">
            <p className="font-mono text-xs text-muted-foreground">Book not found.</p>
          </div>
        </main>
      </div>
    )
  }

  const color = bookColor(book.title)

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          library
        </Link>

        {/* Book header card */}
        <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card mb-8">
          {/* Accent top bar */}
          <div className="h-1 w-full" style={{ backgroundColor: color }} />

          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[60px] opacity-20"
            style={{ backgroundColor: color }}
          />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col gap-4">
              {/* Category label */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {book.category}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl text-balance">
                  {book.title}
                </h1>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  by {book.author}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
                {book.description}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-5 pt-1 border-t border-border/40">
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  {quizzes?.length ?? 0} quizzes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full book quiz CTA */}
        {quiz && (
          <Link
            to="/quiz/$id"
            params={{ id: quiz.id }}
            className="group flex items-center justify-between gap-4 rounded-lg border border-primary/40 bg-primary/5 p-5 mb-6 transition-all hover:border-primary/70 hover:bg-primary/10 hover:shadow-[0_0_20px_-4px] hover:shadow-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="mb-0.5">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest">
                    Full Book
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Complete {book.title} Quiz
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {quizzes?.length ?? 0} sections combined
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        )}

        {/* Section divider + individual quizzes (only when multiple) */}
        {quizzes && quizzes.length > 1 && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-border/60" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                or pick a section
              </span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            <div className="flex flex-col gap-3">
              {quizzes.map((q, index) => (
                <Link
                  key={q.id}
                  to="/quiz/$id"
                  params={{ id: q.id }}
                  className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-[0_0_16px_-4px] hover:shadow-primary/10"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-bold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="font-mono text-[10px] text-primary font-semibold">
                      {q.category}
                    </span>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {q.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {q.description}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
