import FundCallbackPage from '@/components/Dashboard/Wallet-Page/add-fund-fiat-callback'
import React, { Suspense } from 'react'

const page = () => {
  return (
     <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <FundCallbackPage />
    </Suspense>
  )
}

export default page