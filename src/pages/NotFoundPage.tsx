import { EmptyState } from '../components/States'

export default function NotFoundPage() {
  return <EmptyState title="Page not found" text="The page you’re looking for doesn’t exist." action={{ label: 'Back to shop', to: '/' }} />
}
