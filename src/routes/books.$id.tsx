import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Badge, Layers, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { app } from '../lib/api'

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b border-border bg-muted">
            <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
              <div className="h-4 w-24 animate-pulse rounded bg-muted-foreground/20 mb-8" />
              <div className="flex flex-col gap-4">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-muted-foreground/20" />
                <div className="h-8 w-3/4 animate-pulse rounded bg-muted-foreground/20" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted-foreground/20" />
                <div className="h-16 w-full animate-pulse rounded bg-muted-foreground/20" />
              </div>
            </div>
          </section>
          <section className="mx-auto max-w-3xl px-6 py-10 md:py-14">
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          </section>
        </main>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Book not found.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Library
          </Link>
        </div>
      </div>
    )
  }

  // TODO: book.coverColor, book.difficulty, book.quizzes are not in the schema yet
  const totalQuestions = 0

  const difficultyColors: Record<string, string> = {
    easy: "text-green-600 border-green-600",
    medium: "text-yellow-600 border-yellow-600",
    hard: "text-red-600 border-red-600",
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Book Header */}
        <section
          className="border-b border-border"
        >
          <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Library
            </Link>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </div>
              <h1 className="font-serif text-3xl font-black leading-tight text-white md:text-4xl text-balance">
                {book.title}
              </h1>
              <p className="text-base text-white/70">by {book.author}</p>
              <p className="max-w-xl text-sm leading-relaxed text-white/80">
                {book.description}
              </p>
              <div className="mt-1 flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  {totalQuestions} questions total
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz List */}
        <section className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-md bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                      Full Book
                    </span>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    Complete {book.title} Quiz
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    All {totalQuestions} questions from every section combined
                    into one comprehensive quiz.
                  </p>
                </div>
                <Button asChild className="gap-2 shrink-0">
                  <Link to="/" >
                    Start Full Quiz
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
