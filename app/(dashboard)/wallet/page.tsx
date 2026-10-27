import WalletPage from '@/components/Dashboard/Wallet-Page/wallet'
import { WalletPageSkeleton } from '@/components/Dashboard/Wallet-Page/wallet-page-skeleton'
import { Suspense } from 'react'
import { Reveal } from '@/components/ui/reveal'

export default function Page() {
  return (
    <Suspense fallback={<WalletPageSkeleton />}>
      <Reveal>
        <WalletPage />
      </Reveal>
    </Suspense>
  )
}
