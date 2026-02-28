import { app } from "@/src/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useBookCover(
  bookId: string | null | undefined,
  coverUrl?: string | null,
) {
  const { data: fetchedCover } = useQuery({
    queryKey: ["book-cover", bookId],
    queryFn: async () => {
      const res = await app.api.books({ id: bookId! }).cover.get()
      return res.data?.coverUrl ?? null
    },
    enabled: !!bookId && !coverUrl,
    staleTime: Infinity,
  })

  return coverUrl ?? fetchedCover ?? null
}
