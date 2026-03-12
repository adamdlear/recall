import { Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { BookMarked, LogIn, LogOut, ShieldCheck } from 'lucide-react'

export function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  const isAdmin = session?.user?.role === 'admin'

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate({ to: '/' })
  }

  if (isPending) return null

  if (!session) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          to="/login"
          className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:text-foreground"
        >
          <LogIn className="h-3 w-3" />
          sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-sm backdrop-blur-md ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/40 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="font-mono text-xs font-bold text-primary">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
            <span className="text-sm font-medium text-foreground truncate">
              {session.user.name}
            </span>
            <span className="font-mono text-xs font-normal text-muted-foreground truncate">
              {session.user.email}
            </span>
          </DropdownMenuLabel>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary py-1">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/admin/requests" className="cursor-pointer">
                  <BookMarked />
                  Book Requests
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
