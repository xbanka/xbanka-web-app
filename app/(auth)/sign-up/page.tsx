import SignUp from "@/components/auth/sign-up";
import { AuthSplit } from "@/components/auth/hero/auth-split";

const page = () => {
  return (
    <AuthSplit page="signup">
      <div className="w-full px-4 py-10 max-sm:p-0 lg:px-0">
        <SignUp />
      </div>
    </AuthSplit>
  );
};

export default page;
