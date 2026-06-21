import { createFileRoute } from '@tanstack/react-router'
import { CountryMoviesPage } from '@/pages/country-movies'

export const Route = createFileRoute('/country/$id')({
  component: () => <CountryMoviesPage />,
})
