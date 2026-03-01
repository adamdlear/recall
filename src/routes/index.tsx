import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Award, BookOpen, Brain } from 'lucide-react'
import { BookSearch } from '../components/books/book-search'
import { BooksGrid } from '../components/books/books-grid'
import { app } from '../lib/api'

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

function RouteComponent() {
  const { q } = Route.useSearch()

  const { data, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await app.api.books.get({ query: { q } })
      return res.data
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl text-balance">
                Read. Quiz. Master.
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
                Pick a book, test your understanding with curated questions, and
                deepen your knowledge with detailed explanations for every
                answer.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "Choose a Book",
                  desc: "Select from our curated library of great reads",
                },
                {
                  icon: Brain,
                  title: "Answer Questions",
                  desc: "Test your knowledge with thoughtful quizzes",
                },
                {
                  icon: Award,
                  title: "Learn & Grow",
                  desc: "Get detailed explanations for every answer",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-6 text-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
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

        {/* Library Search Section */}
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Search the Library
          </h2>
          <BookSearch />
        </section>

        {/* Book Grid */}
        <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <BooksGrid books={data} isLoading={isLoading} />
        </section>
      </main>
    </div>
  )
}
