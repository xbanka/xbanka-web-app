import { CryptoPage } from "@/components/Dashboard/Crypto-Page/crypto-page";
import { CryptoPageSkeleton } from "@/components/Dashboard/Crypto-Page/crypto-page-skeleton";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<CryptoPageSkeleton />}>
      <CryptoPage />
    </Suspense>
  );
};

export default page;
