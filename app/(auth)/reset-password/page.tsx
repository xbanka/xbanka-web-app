import ResetPassword from '@/components/auth/reset-password'
import { AuthSplit } from "@/components/auth/hero/auth-split";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return (
    <AuthSplit>
      <ResetPassword email={email} />
    </AuthSplit>
  )
}
