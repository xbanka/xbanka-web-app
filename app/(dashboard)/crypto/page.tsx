import { CryptoPage } from "@/components/Dashboard/Crypto-Page/crypto-page";
<<<<<<< HEAD
=======
import { CryptoPageSkeleton } from "@/components/Dashboard/Crypto-Page/crypto-page-skeleton";
>>>>>>> origin/main
import { Suspense } from "react";

const page = () => {
  return (
<<<<<<< HEAD
    <Suspense fallback={<p>Signing you in...</p>}>
=======
    <Suspense fallback={<CryptoPageSkeleton />}>
>>>>>>> origin/main
      <CryptoPage />
    </Suspense>
  );
};

export default page;
