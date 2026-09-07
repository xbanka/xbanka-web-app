import { MarketPage } from "@/components/Dashboard/Crypto-Page/market-page";
import { MarketPageSkeleton } from "@/components/Dashboard/Crypto-Page/market-page-skeleton";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<MarketPageSkeleton />}>
      <MarketPage />
    </Suspense>
  );
};

export default page;
