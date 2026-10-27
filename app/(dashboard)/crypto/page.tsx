import { CryptoPage } from "@/components/Dashboard/Crypto-Page/crypto-page";
import { CryptoPageSkeleton } from "@/components/Dashboard/Crypto-Page/crypto-page-skeleton";
import { Suspense } from "react";
import { Reveal } from "@/components/ui/reveal";

const page = () => {
  return (
    <Suspense fallback={<CryptoPageSkeleton />}>
      <Reveal>
        <CryptoPage />
      </Reveal>
    </Suspense>
  );
};

export default page;
