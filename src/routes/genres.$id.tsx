import { createFileRoute } from '@tanstack/react-router'
import { GenreMoviesPage } from '@/pages/genre-movies'

export const Route = createFileRoute('/genres/$id')({
  component: () => <GenreMoviesPage />,
})
