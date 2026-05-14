import AccountPage from "@/components/Dashboard/Account-Page/account-page";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<p>Signing you in...</p>}>
      <AccountPage />
    </Suspense>
  );
};

export default page;
