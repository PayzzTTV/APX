"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Une erreur est survenue</h1>
          <p className="text-gray-400 mb-6">
            Nous avons été notifiés et travaillons à résoudre le problème.
          </p>
          <button
            onClick={() => reset()}
            className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
