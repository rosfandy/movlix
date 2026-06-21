import { createFileRoute } from '@tanstack/react-router'
import { DiscoverPage } from '@/pages/discover-page'

export const Route = createFileRoute('/movies/')({
  component: () => <DiscoverPage mediaType="movie" title="Movies" tag="MOVIE" />,
})
