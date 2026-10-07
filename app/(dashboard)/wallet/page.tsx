import WalletPage from '@/components/Dashboard/Wallet-Page/wallet'
<<<<<<< HEAD
=======
import { WalletPageSkeleton } from '@/components/Dashboard/Wallet-Page/wallet-page-skeleton'
>>>>>>> origin/main
import { Suspense } from 'react'

export default function Page() {
  return (
<<<<<<< HEAD
    <Suspense fallback={<p>Wallet page...</p>}>
=======
    <Suspense fallback={<WalletPageSkeleton />}>
>>>>>>> origin/main
      <WalletPage />
    </Suspense>
  )
}
