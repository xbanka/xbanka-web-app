import WalletPage from '@/components/Dashboard/Wallet-Page/wallet'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<p>Wallet page...</p>}>
      <WalletPage />
    </Suspense>
  )
}
