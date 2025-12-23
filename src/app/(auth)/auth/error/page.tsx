"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification link may have expired or already been used.",
  Default: "An error occurred during authentication.",
  CredentialsSignin: "Invalid email or password. Please try again.",
  OAuthSignin: "Error starting the OAuth sign-in flow.",
  OAuthCallback: "Error handling the OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth provider account.",
  EmailCreateAccount: "Could not create email provider account.",
  Callback: "Error in authentication callback.",
  OAuthAccountNotLinked:
    "This email is already associated with another account. Please sign in with that account.",
  EmailSignin: "Error sending the email with magic link.",
  SessionRequired: "Please sign in to access this page.",
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") ?? "Default"

  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-cream-300">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-forest-800">
          Authentication Error
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We couldn&apos;t complete your request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <p className="text-sm text-center text-destructive">{errorMessage}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          asChild
          className="w-full bg-forest-800 hover:bg-forest-900 text-cream-100"
        >
          <Link href="/auth/login">Try Again</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Go Home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ErrorFallback() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-cream-300">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full" />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<ErrorFallback />}>
      <ErrorContent />
    </Suspense>
  )
}
