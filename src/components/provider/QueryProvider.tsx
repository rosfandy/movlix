import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => queryClient)

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
