import React from 'react'
import DashboardFeature from '@/features/dashboard/DashboardFeature.jsx'
import ErrorBoundary    from '@/components/feedback/ErrorBoundary.jsx'

export default function DashboardPanel() {
  return (
    <ErrorBoundary>
      <DashboardFeature />
    </ErrorBoundary>
  )
}
