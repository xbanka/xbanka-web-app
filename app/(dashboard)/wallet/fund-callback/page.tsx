import FundCallbackPage from '@/components/Dashboard/Wallet-Page/add-fund-fiat-callback'
import { PageLoader } from '@/components/ui/page-loader'
import { LucideArrowLeftRight } from 'lucide-react'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense
      fallback={
        <PageLoader
          icon={LucideArrowLeftRight}
          title="Confirming your payment..."
          description="This usually takes a few seconds. Please don’t close this window"
        />
      }
    >
      <FundCallbackPage />
    </Suspense>
  )
}

export default page
