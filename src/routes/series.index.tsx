import { createFileRoute } from '@tanstack/react-router'
import { DiscoverPage } from '@/pages/discover-page'

export const Route = createFileRoute('/series/')({
  component: () => <DiscoverPage mediaType="tv" title="TV Series" tag="TV SERIES" />,
})
