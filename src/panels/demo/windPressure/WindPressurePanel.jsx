import React from 'react'
import ErrorBoundary        from '@/components/feedback/ErrorBoundary.jsx'
import WindPressureFeature  from '@/features/demo/windPressure/WindPressureFeature.jsx'

export default function WindPressurePanel() {
  return (
    <ErrorBoundary>
      <WindPressureFeature />
    </ErrorBoundary>
  )
}
