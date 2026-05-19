import ForgotPassword from '@/components/auth/forgot-password'
import SignIn from '@/components/auth/sign-in'
import React from 'react'

const page = () => {
  return (
    <div className='bg-background min-h-dvh grid place-items-center max-sm:block'>
      <ForgotPassword />
    </div>
  )
}

export default page
