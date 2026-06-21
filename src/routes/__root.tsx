import { createRootRoute, Outlet } from '@tanstack/react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { QueryProvider } from '@/components/provider/QueryProvider'

export const Route = createRootRoute({
  component: () => (
    <QueryProvider>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </QueryProvider>
  ),
})
