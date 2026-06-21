import { createFileRoute } from '@tanstack/react-router'
import { GenresPage } from '@/pages/genres'

export const Route = createFileRoute('/genres/')({
  component: () => <GenresPage />,
})
