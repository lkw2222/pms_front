import React from 'react'
import GisFeature    from '@/features/gis/GisFeature.jsx'
import ErrorBoundary from '@/components/feedback/ErrorBoundary.jsx'

export default function GisPanel() {
  return (
    <ErrorBoundary>
      <GisFeature />
    </ErrorBoundary>
  )
}
