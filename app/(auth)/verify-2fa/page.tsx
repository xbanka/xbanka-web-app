import VerifyTwoFactor from "@/components/auth/VerifyTwoFa";
import { AuthSplit } from "@/components/auth/hero/auth-split";

const page = () => {
  return (
    <AuthSplit>
      <VerifyTwoFactor />
    </AuthSplit>
  );
};

export default page;