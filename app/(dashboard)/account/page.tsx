import AccountPage from "@/components/Dashboard/Account-Page/account-page";
import { AccountPageSkeleton } from "@/components/Dashboard/Account-Page/account-page-skeleton";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountPage />
    </Suspense>
  );
};

export default page;
