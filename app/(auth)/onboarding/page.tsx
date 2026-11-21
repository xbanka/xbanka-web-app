import OnboardingForm from "@/components/auth/onboarding/OnboardingForm";
import { AuthSplit } from "@/components/auth/hero/auth-split";

const page = () => {
  return (
    <AuthSplit>
      <div className="w-full sm:py-10 lg:py-0">
        <OnboardingForm />
      </div>
    </AuthSplit>
  );
};

export default page;
