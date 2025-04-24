import { GitHubLoginForm } from '@/components/oauth/oauth-github/github-login-form'
import { GoogleLoginForm } from '@/components/oauth/oauth-google/google-login-form'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      TOPページ<br />
      <div className="w-full max-w-sm">
        <GitHubLoginForm />
        <GoogleLoginForm />
      </div>
    </div>
  )
}
