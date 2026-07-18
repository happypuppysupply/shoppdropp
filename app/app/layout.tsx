import { AuthProvider } from '@/components/auth/AuthProvider'
import { AppShell } from '@/components/app/AppShell'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  )
}
