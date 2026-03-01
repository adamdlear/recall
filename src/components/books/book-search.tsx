import { Input } from "@/src/components/ui/input"
import { useNavigate } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type BookSearchProps = {
  currentQuery?: string
}

export function BookSearch({ currentQuery }: BookSearchProps) {
  const [value, setValue] = useState(currentQuery ?? "")
  const navigate = useNavigate({ from: "/" })
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    timer.current = setTimeout(() => {
      navigate({ search: { q: value || undefined } })
    }, 300)
    return () => clearTimeout(timer.current)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder="Search by title or author…"
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}
