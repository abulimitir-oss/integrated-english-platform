'use client'

import Navigation from './Navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main>{children}</main>
    </div>
  )
}

