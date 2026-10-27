import { MarketPage } from "@/components/Dashboard/Crypto-Page/market-page";
import { MarketPageSkeleton } from "@/components/Dashboard/Crypto-Page/market-page-skeleton";
import { Suspense } from "react";
import { Reveal } from "@/components/ui/reveal";

const page = () => {
  return (
    <Suspense fallback={<MarketPageSkeleton />}>
      <Reveal>
        <MarketPage />
      </Reveal>
    </Suspense>
  );
};

export default page;
