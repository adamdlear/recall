import { QuizFlow } from '../components/quizzes/quiz-flow'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { app } from '../lib/api'

export const Route = createFileRoute('/quiz/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const res = await app.api.quizzes({ id }).get()
      return res.data
    },
  })

  const { data: book } = useQuery({
    queryKey: ["book", quiz?.bookId],
    enabled: !!quiz?.bookId,
    queryFn: async () => {
      const res = await app.api.books({ id: quiz!.bookId! }).get()
      return res.data
    },
  })

  const { data: questions } = useQuery({
    queryKey: ["questions", id],
    queryFn: async () => {
      const res = await app.api.quizzes({ id }).questions.get()
      return res.data
    },
  })

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <h1>No Quiz Found</h1>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <QuizFlow book={book} quiz={quiz} questions={questions ?? []} />
      </main>
    </div>
  )
}
