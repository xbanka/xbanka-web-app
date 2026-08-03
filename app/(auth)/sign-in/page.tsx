import SignIn from '@/components/auth/sign-in'
import React from 'react'

const page = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error as string | undefined;
  
  return (
    <div className='bg-background min-h-dvh grid place-items-center max-sm:block'>
      <SignIn urlError={error} />
    </div>
  )
}

export default page
