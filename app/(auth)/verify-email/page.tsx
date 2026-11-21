import VerifyPage from "@/components/auth/verify-email";
import { AuthSplit } from "@/components/auth/hero/auth-split";


export default async function Verify({ searchParams }: { searchParams: Promise<{ token?: string }>; }) {
  const { token } = await searchParams;
  return (
      <AuthSplit>
        <VerifyPage token={token} />
      </AuthSplit>
  );
};

