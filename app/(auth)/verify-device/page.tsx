import VerifyDevice from "@/components/auth/verify-device";
import { AuthSplit } from "@/components/auth/hero/auth-split";

const page = () => {
  return (
    <AuthSplit>
      <VerifyDevice />
    </AuthSplit>
  );
};

export default page;
 