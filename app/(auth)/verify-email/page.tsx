import VerifyPage from "@/components/auth/verify-email";


export default async function Verify({ searchParams }: { searchParams: Promise<{ token?: string }>; }) {
  const { token } = await searchParams;
  return (
      <div>
        <VerifyPage token={token} />
      </div>
  );
};

