import { createFileRoute } from '@tanstack/react-router'
import { CountriesPage } from '@/pages/countries-page'

export const Route = createFileRoute('/country/')({
  component: () => <CountriesPage />,
})
