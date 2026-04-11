import React from 'react'
import GridFeature   from '@/features/grid/GridFeature.jsx'
import ErrorBoundary from '@/components/feedback/ErrorBoundary.jsx'

export default function GridPanel() {
  return (
    <ErrorBoundary>
      <GridFeature />
    </ErrorBoundary>
  )
}
