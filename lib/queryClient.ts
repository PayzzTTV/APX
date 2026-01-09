import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Données considérées fraîches pendant 5 minutes
        staleTime: 5 * 60 * 1000,
        // Garder en cache pendant 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry 1 fois en cas d'erreur
        retry: 1,
        // Ne pas refetch au focus de la fenêtre par défaut
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: toujours créer un nouveau client
    return makeQueryClient()
  } else {
    // Browser: réutiliser le même client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
