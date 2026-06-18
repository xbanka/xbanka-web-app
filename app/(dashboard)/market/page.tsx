import { MarketPage } from "@/components/Dashboard/Crypto-Page/market-page";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<p>Loading market...</p>}>
      <MarketPage />
    </Suspense>
  );
};

export default page;
