import GoogleCallbackClient from "@/components/auth/GoogleCallbackClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Signing you in...</p>}>
      <GoogleCallbackClient />
    </Suspense>
  );
}