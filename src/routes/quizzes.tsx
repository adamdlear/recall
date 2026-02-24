import { Award, BookOpen, Brain } from "lucide-react";
import { app } from "@/src/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes")({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useQuery({
		queryKey: ["quizzes"],
		queryFn: async () => {
			return await app.api.quizzes.get();
		},
	})

	return (
		<div>
			<section className="border-b border-border bg-card">
				<div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl text-balance">
							Read. Quiz. Master.
						</h1>
						<p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
							Pick a book, test your understanding with curated questions, and
							deepen your knowledge with detailed explanations for every answer.
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

			{/* Book Grid */}
			<section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
				<div className="flex flex-col gap-10">
					{categories.map((category) => (
						<div key={category}>
							<div className="mb-5 flex items-center gap-3">
								<h2 className="font-serif text-xl font-bold text-foreground">
									{category}
								</h2>
								<div className="h-px flex-1 bg-border" />
								<span className="text-xs font-medium text-muted-foreground">
									{books.filter((b) => b.category === category).length}{" "}
									{books.filter((b) => b.category === category).length === 1
										? "book"
										: "books"}
								</span>
							</div>
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
								{books
									.filter((b) => b.category === category)
									.map((book) => (
										<BookCard key={book.id} book={book} />
									))}
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
