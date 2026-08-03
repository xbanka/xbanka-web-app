import ResetPassword from '@/components/auth/reset-password'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return (
    <div className='bg-background min-h-dvh grid place-items-center max-sm:block'>
      <ResetPassword email={email} />
    </div>
  )
}
