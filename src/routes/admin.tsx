import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session || session.user?.role !== "admin") {
      throw redirect({ to: "/" })
    }
  }
})

function RouteComponent() {
  return <div>Hello "/admin"!</div>
}
