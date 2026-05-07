'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUsers, User } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner'
import StatsGrid from '@/components/dashboard/StatsGrid'
import TeamMembersList from '@/components/dashboard/TeamMembersList'
import ModulesGrid from '@/components/dashboard/ModulesGrid'
import RecentActivity from '@/components/dashboard/RecentActivity'
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton'
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [currentUser, allUsers] = await Promise.all([
          getCurrentUser(token),
          getUsers(token),
        ])
        setUser(currentUser)
        setUsers(allUsers)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) return null

  const hasData = users.length > 0

  return (
    <AppLayout
      user={user}
      breadcrumbs={[{ label: 'NexoRH' }, { label: 'Dashboard' }]}
    >
      <WelcomeBanner user={user} />
      <StatsGrid users={users} />

      {!hasData ? (
        <DashboardEmptyState />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <TeamMembersList users={users} />
          <div className="xl:col-span-1">
            <RecentActivity />
          </div>
        </div>
      )}

      <ModulesGrid />
    </AppLayout>
  )
}
