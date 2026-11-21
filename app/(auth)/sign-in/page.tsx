import SignIn from "@/components/auth/sign-in";
import { AuthSplit } from "@/components/auth/hero/auth-split";

const page = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error as string | undefined;

  return (
    // Phones open on the Welcome screen, unless there's an error to show.
    <AuthSplit mobileWelcome={!error}>
      <SignIn urlError={error} />
    </AuthSplit>
  );
};

export default page;
