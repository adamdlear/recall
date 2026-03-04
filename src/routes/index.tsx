import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, BookOpen, Brain } from 'lucide-react'
import { BookSearch } from '../components/books/book-search'
import { BooksGrid } from '../components/books/books-grid'
import { app } from '../lib/api'
import { ModeToggle } from '../components/theme-toggle'
import { books } from '@/server/db/schema'

type BookSearchParams = {
  q?: string
}

export const Route = createFileRoute('/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookSearchParams => {
    return {
      q: (search.q as string) || undefined
    }
  }
})

const steps = [
  {
    icon: BookOpen,
    label: "01",
    title: "Pick a book",
    desc: "Choose from our curated library of high-signal reads.",
  },
  {
    icon: Brain,
    label: "02",
    title: "Take a quiz",
    desc: "Chapter or full-book. Each question has a specific answer.",
  },
  {
    icon: Award,
    label: "03",
    title: "Lock it in",
    desc: "Explanations teach you why — not just what — you got right.",
  },
]

function RouteComponent() {
  const { q } = Route.useSearch()

  const { data, isLoading } = useQuery({
    queryKey: ["books", q],
    queryFn: async () => {
      const res = await app.api.books.get({ query: { q } })
      return res.data
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          {/* dot-grid background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* cyan glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary/10 blur-[120px]"
          />

          <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
              Read smarter.{" "}
              <span className="text-primary">Prove it.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
              Chapter-by-chapter quizzes built for developers who actually want
              to retain what they read — not just highlight it.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                hash="library"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
              >
                Browse the library
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b border-border/60 bg-card/40">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 sm:divide-x divide-border/60">
              {steps.map((step) => (
                <div
                  key={step.label}
                  className="flex flex-col gap-3 px-6 py-4 first:pl-0 last:pr-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary">
                      {step.label}
                    </span>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search */}
        <section id="library" className="border-b border-border/60 bg-background sticky top-0 z-10 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-6 py-6 md:py-8">
            <BookSearch currentQuery={q} />
          </div>
        </section>

        {/* Book Grid */}
        <section id="library" className="mx-auto max-w-5xl px-6 py-10 md:py-16">
          <BooksGrid books={data} isLoading={isLoading} />
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-6">
          <ModeToggle />
        </div>
      </footer>
    </div>
  )
}
