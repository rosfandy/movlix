import { createFileRoute } from '@tanstack/react-router'
import { MovieDetailPage } from '@/pages/movie-detail'

export const Route = createFileRoute('/movies/$slug')({
  component: MovieDetailPage,
})
