const BASE_URL = "https://www.googleapis.com/books/v1"
const VOLUMES_URL = `${BASE_URL}/volumes`

type BookSearchFilters = {
  q?: string;
  title?: string;
  author?: string;
  isbn?: string;
}

export type GoogleBook = {
  googleId: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string | null;
  categories: string[];
  publishedDate: string | null;
}

function getGoogleBooksApiKey(): string {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_BOOKS_API_KEY environment variable not set")
  }
  return apiKey
}

export async function getBookCoverUrl(isbn: string): Promise<string | null> {
  const apiKey = getGoogleBooksApiKey()
  const url = new URL(VOLUMES_URL);
  url.searchParams.set("q", `isbn:${isbn}`);
  url.searchParams.set("fields", "items/volumeInfo/imageLinks");
  url.searchParams.set("key", apiKey);
  const res = await fetch(url.toString());
  const data = await res.json();
  const thumbnail: string | undefined = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
  if (!thumbnail) {
    return null
  }
  return thumbnail.replace("http://", "https://").replace("zoom=1", "zoom=0");
}

export async function searchBooks({ q, title, author, isbn }: BookSearchFilters): Promise<GoogleBook[]> {
  const apiKey = getGoogleBooksApiKey()

  const parts: string[] = []
  if (q) parts.push(q)
  if (title) parts.push(`intitle:${title}`)
  if (author) parts.push(`inauthor:${author}`)
  if (isbn) parts.push(`isbn:${isbn}`)

  const query = parts.join(" ")
  if (!query) return []

  const url = new URL(VOLUMES_URL)
  url.searchParams.set("q", query)
  url.searchParams.set("maxResults", "12")
  url.searchParams.set("fields", "items(id,volumeInfo(title,authors,description,imageLinks(thumbnail),categories,publishedDate))")
  url.searchParams.set("key", apiKey)

  const res = await fetch(url.toString())
  const data = await res.json()

  if (!data.items) return []

  return data.items.map((item: any) => {
    const info = item.volumeInfo
    const thumbnail: string | undefined = info.imageLinks?.thumbnail
    return {
      googleId: item.id,
      title: info.title ?? "Unknown Title",
      author: (info.authors as string[] | undefined)?.join(", ") ?? "Unknown Author",
      description: info.description ?? "",
      coverUrl: thumbnail ? thumbnail.replace("http://", "https://").replace("zoom=1", "zoom=0") : null,
      categories: (info.categories as string[] | undefined) ?? [],
      publishedDate: info.publishedDate ?? null,
    }
  })
}
