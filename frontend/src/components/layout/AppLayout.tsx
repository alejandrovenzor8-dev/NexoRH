'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface Breadcrumb {
  label: string
  href?: string
}

interface AppLayoutProps {
  user: { fullName: string; email: string; role: string } | null
  children: React.ReactNode
  breadcrumbs?: Breadcrumb[]
}

export default function AppLayout({ user, children, breadcrumbs }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        user={user}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          user={user}
          breadcrumbs={breadcrumbs}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
