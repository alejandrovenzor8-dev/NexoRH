'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { CandidateCardStatesDemo } from '@/components/recruitment/STATES_DEMO'
import type { UserSession } from '@/types/auth'

export default function RecruitmentDemoPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

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
        { label: 'Demo - Estados del Card' },
      ]}
    >
      <CandidateCardStatesDemo />
    </AppLayout>
  )
}
