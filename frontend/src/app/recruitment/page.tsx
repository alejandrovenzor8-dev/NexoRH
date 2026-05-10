'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { RecruitmentBoard } from '@/components/recruitment'
import type { UserSession } from '@/types/auth'

/**
 * Página principal del sistema de reclutamiento Kanban
 */
export default function RecruitmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    // Obtener usuario actual
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        router.replace('/login')
        return
      }
    }

    setLoading(false)
  }, [router])

  if (loading || !user) {
    return <div className="min-h-screen bg-white" />
  }

  return (
    <AppLayout
      user={user}
      breadcrumbs={[
        { label: 'NexoRH' },
        { label: 'Reclutamiento' },
        { label: 'Pipeline' },
      ]}
    >
      <div className="space-y-6 pb-10">
        {/* Contenido principal */}
        <RecruitmentBoard />
      </div>
    </AppLayout>
  )
}
