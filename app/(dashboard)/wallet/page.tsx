import WalletPage from '@/components/Dashboard/Wallet-Page/wallet'
import { WalletPageSkeleton } from '@/components/Dashboard/Wallet-Page/wallet-page-skeleton'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<WalletPageSkeleton />}>
      <WalletPage />
    </Suspense>
  )
}
