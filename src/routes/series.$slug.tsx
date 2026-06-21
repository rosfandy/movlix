import { createFileRoute } from '@tanstack/react-router'
import { TvDetailPage } from '@/pages/tv-detail'

export const Route = createFileRoute('/series/$slug')({
  component: () => <TvDetailPage />,
})
