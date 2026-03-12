import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { app } from '../lib/api'
import { useState } from 'react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Check, X, ExternalLink, BookOpen, Clock, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/admin/requests')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession()
    if (!session || session.user?.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
})

type RequestStatus = 'submitted' | 'under_review' | 'accepted' | 'denied'

const STATUS_FILTERS: { label: string; value: RequestStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Denied', value: 'denied' },
]

function statusBadge(status: RequestStatus) {
  const map: Record<RequestStatus, { label: string; className: string }> = {
    submitted: {
      label: 'Submitted',
      className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    under_review: {
      label: 'Under Review',
      className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    accepted: {
      label: 'Accepted',
      className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    denied: {
      label: 'Denied',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  }
  const { label, className } = map[status]
  return (
    <Badge variant="outline" className={cn('font-mono text-xs', className)}>
      {label}
    </Badge>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type Request = {
  id: string
  bookId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  requestedBy: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

function RequestCard({ request }: { request: Request }) {
  const queryClient = useQueryClient()

  const { mutate: updateStatus, isPending, variables } = useMutation({
    mutationFn: async (status: 'accepted' | 'denied' | 'under_review') => {
      const res = await app.api['book-requests']({ id: request.id }).patch({ status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })

  const isActionable = request.status === 'submitted' || request.status === 'under_review'

  return (
    <div className="group flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-border">
      {/* Top row: user + status + date */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {request.requestedBy.image ? (
            <img
              src={request.requestedBy.image}
              alt={request.requestedBy.name}
              className="h-8 w-8 rounded-full shrink-0 object-cover ring-1 ring-border"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-border">
              <span className="text-xs font-semibold text-primary">
                {request.requestedBy.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {request.requestedBy.name}
            </p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {request.requestedBy.email}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {statusBadge(request.status)}
          <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(request.createdAt)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/60" />

      {/* Bottom row: book link + actions */}
      <div className="flex items-center justify-between gap-3">
        <a
          href={`https://books.google.com/books?id=${request.bookId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <BookOpen className="h-3.5 w-3.5" />
          View on Google Books
          <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
        </a>

        {isActionable && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              disabled={isPending}
              onClick={() => updateStatus('denied')}
            >
              {isPending && variables === 'denied' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              Deny
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isPending}
              onClick={() => updateStatus('accepted')}
            >
              {isPending && variables === 'accepted' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function RouteComponent() {
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const res = await app.api['book-requests'].get()
      return res.data as Request[]
    },
  })

  const filtered = requests
    ? filter === 'all'
      ? requests
      : requests.filter((r) => r.status === filter)
    : []

  const counts = requests
    ? STATUS_FILTERS.reduce(
        (acc, f) => {
          acc[f.value] =
            f.value === 'all'
              ? requests.length
              : requests.filter((r) => r.status === f.value).length
          return acc
        },
        {} as Record<string, number>,
      )
    : {}

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Admin
            </span>
            <div className="h-px w-6 bg-border/60" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Book Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and action user-submitted book requests.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1 w-fit">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
              {counts[f.value] != null && counts[f.value] > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none',
                    filter === f.value
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {counts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border/60 bg-card py-16 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {filter === 'all' ? 'No book requests yet.' : `No ${filter.replace('_', ' ')} requests.`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
