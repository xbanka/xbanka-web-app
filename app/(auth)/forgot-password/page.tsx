import ForgotPassword from '@/components/auth/forgot-password'
import SignIn from '@/components/auth/sign-in'
import React from 'react'
import { AuthSplit } from "@/components/auth/hero/auth-split";

const page = () => {
  return (
    <AuthSplit>
      <ForgotPassword />
    </AuthSplit>
  )
}

export default page
