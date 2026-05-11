import { CryptoPage } from "@/components/Dashboard/Crypto-Page/crypto-page";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<p>Signing you in...</p>}>
        <CryptoPage />
    </Suspense>
  )
};

export default page