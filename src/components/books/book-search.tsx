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
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        className="w-full rounded-md border border-border/60 bg-card py-2.5 pl-10 pr-10 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
        placeholder="Search by title or author..."
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}
