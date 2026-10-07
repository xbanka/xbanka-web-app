import GoogleCallbackClient from "@/components/auth/GoogleCallbackClient";
import { PageLoader } from "@/components/ui/page-loader";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader title="Signing you in..." />}>
      <GoogleCallbackClient />
    </Suspense>
  );
}
