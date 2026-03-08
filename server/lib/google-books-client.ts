const BASE_URL = "https://www.googleapis.com/books/v1"
const VOLUMES_URL = `${BASE_URL}/volumes`

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
