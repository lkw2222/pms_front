import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.jsx'
import { queryClient } from './lib/queryClient.js'
import { useAppStore } from './store/useAppStore.js'
import './styles/index.css'
import './styles/dockview.css'

// 앱 시작 시 저장된 테마 즉시 적용 (깜빡임 방지)
const savedTheme = useAppStore.getState().theme
document.documentElement.setAttribute('data-theme', savedTheme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 개발 환경에서만 TanStack Query Devtools 표시 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>
)
