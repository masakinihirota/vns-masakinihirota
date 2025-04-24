import { AnonymousLoginForm } from '@/components/oauth/oauth-anonymous/anonymous-login-form'
import { GitHubLoginForm } from '@/components/oauth/oauth-github/github-login-form'
import { GoogleLoginForm } from '@/components/oauth/oauth-google/google-login-form'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Link href="/" className="text-sm text-blue-500 mb-4 block">TOPページ</Link>
      <div className="w-full max-w-sm">
      <AnonymousLoginForm />
      <GitHubLoginForm />
      <GoogleLoginForm />
      </div>
    </div>
  )
}
