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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { BookMarked, LogIn, LogOut, ShieldCheck } from 'lucide-react'

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true" className="size-4 shrink-0">
    <path
      d="M32 0a32.021 32.021 0 0 0-10.1 62.4c1.6.3 2.2-.7 2.2-1.5v-6c-8.9 1.9-10.8-3.8-10.8-3.8-1.5-3.7-3.6-4.7-3.6-4.7-2.9-2 .2-1.9.2-1.9 3.2.2 4.9 3.3 4.9 3.3 2.9 4.9 7.5 3.5 9.3 2.7a6.93 6.93 0 0 1 2-4.3c-7.1-.8-14.6-3.6-14.6-15.8a12.27 12.27 0 0 1 3.3-8.6 11.965 11.965 0 0 1 .3-8.5s2.7-.9 8.8 3.3a30.873 30.873 0 0 1 8-1.1 30.292 30.292 0 0 1 8 1.1c6.1-4.1 8.8-3.3 8.8-3.3a11.965 11.965 0 0 1 .3 8.5 12.1 12.1 0 0 1 3.3 8.6c0 12.3-7.5 15-14.6 15.8a7.746 7.746 0 0 1 2.2 5.9v8.8c0 .9.6 1.8 2.2 1.5A32.021 32.021 0 0 0 32 0z"
      fill="currentColor"
    />
  </svg>
)

export function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  const isAdmin = session?.user?.role === 'admin'

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.origin + "/",
    })
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    navigate({ to: '/' })
  }

  if (isPending) return null

  if (!session) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-auto rounded-full border border-border/60 bg-background/80 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur-md hover:bg-background/80 hover:text-foreground">
              <LogIn className="h-3 w-3" />
              sign in
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm bg-card/90 backdrop-blur-xl border-border/60">
            <DialogHeader>
              <span className="font-mono text-xs font-bold text-primary">—— auth</span>
              <DialogTitle className="text-base">Sign in to Recall</DialogTitle>
              <DialogDescription>
                Connect your GitHub account to track your reading and quiz progress.
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full gap-2" onClick={handleSignIn}>
              <GitHubIcon />
              Continue with GitHub
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full border border-border/60 bg-background/80 shadow-sm backdrop-blur-md hover:bg-background/80 hover:ring-2 hover:ring-primary/40 hover:ring-offset-2 ring-offset-background">
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
          </Button>
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
