'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthModal } from '../components/AuthModal'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [modalOpen, setModalOpen] = useState(true)

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  const handleClose = () => {
    setModalOpen(false)
    // If they close without auth, go home
    router.push('/')
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
        <div className="flex items-center gap-3 text-white/50">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // If authenticated, don't render (will redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
        <div className="flex items-center gap-3 text-white/50">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span>Redirecting to dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={modalOpen} 
        onClose={handleClose}
        defaultMode="signin"
      />
    </div>
  )
}
