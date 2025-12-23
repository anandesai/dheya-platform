"use client"

import { useEffect } from "react"
import { ErrorDisplay } from "@/components/error-boundary"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App Error:", error)
  }, [error])

  return (
    <ErrorDisplay
      title="Something went wrong"
      message="We're sorry, but something went wrong. Please try again."
      reset={reset}
    />
  )
}
