import AccountPage from "@/components/Dashboard/Account-Page/account-page";
import { AccountPageSkeleton } from "@/components/Dashboard/Account-Page/account-page-skeleton";
import React, { Suspense } from "react";
import { Reveal } from "@/components/ui/reveal";

const page = () => {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <Reveal>
        <AccountPage />
      </Reveal>
    </Suspense>
  );
};

export default page;
