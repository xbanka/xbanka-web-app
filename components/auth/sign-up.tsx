"use client";

import { Card } from "../ui/FormCard";
import Link from "next/link";
import { FormField } from "../ui/FormField";
import { Calendar, ChevronLeft, Globe, Lock, Mail, Phone, Plus, User } from "lucide-react";
import { SelectField } from "../ui/select";
import { countryOptions } from "@/lib/countries";
import { SignupFormData, signUpSchema } from "@/lib/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import PasswordField from "../ui/password-field";
import Image from "next/image";
import { useResendVerifyMail, useSignup } from "@/lib/services/auth.service";
import { useEffect, useState } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { maskEmail } from "@/lib/maskEmail";
import { ErrorField } from "../ui/field-error";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ErrorLayout } from "../ui/error-layout";
import MailPic  from "../../public/mail.svg";
import { PrivacyPolicyLink } from "@/components/legal/privacy-policy-link";
import { cn } from "@/lib/utils";
import { AUTH_BUTTON, AUTH_CARD, AUTH_FIELD } from "./auth-styles";

const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
] as const;

const SignUp = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  /** Two short steps: 1 = email and password, 2 = about you. */
  const [step, setStep] = useState<1 | 2>(1);
  const [showReferral, setShowReferral] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { loginWithGoogle } = useGoogleAuth();
  const {
    mutate: resendMutate,
    isPending: resendPending,
    error: resendError,
  } = useResendVerifyMail();
  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      referral: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      country: "",
    },
  });

  const {
    formState: { isValid },
    reset,
  } = methods;

  const { data, error, mutate, isSuccess, isPending } = useSignup();
  const gender = methods.watch("gender");

  const onSubmit = (data: SignupFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setShowSuccess(true);
        setUserEmail(data.email);
        setCountdown(60);
      },
    });
  };

  const handleResendVerification = () => {
    resendMutate(userEmail);
    setCountdown(60);
  };

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (showSuccess && isSuccess && data?.success) {
    return (
      <Card className="space-y-6 text-center">
        <div className="relative h-24 w-32.25 flex items-center justify-center mx-auto">
          <Image src={MailPic} alt="mail" className="" fill />
        </div>
        <div className="space-y-4">
          <h2 className="text-[36px] max-sm:text-[28px] leading-11 max-sm:leading-[36px] font-bold text-card-text">
            Verify your email address
          </h2>
          <p className="font-normal leading-6 text-[16px] text-text px-7">
            We sent a verification link to{" "}
            <strong className="text-text-border">{maskEmail(userEmail)}</strong>{" "}
            Check your inbox or spam to verify your account
          </p>
          <ErrorField message={resendError?.message} />
        </div>
        <div className="text-center mt-6 font-normal leading-6 text-[16px] text-text">
          Did not get the email?{" "}
          <Button
            disabled={countdown > 0 || resendPending}
            onClick={handleResendVerification}
            className="w-full border-none bg-transparent text-Green hover:bg-transparent"
          >
            {resendPending
              ? "Sending..."
              : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend verification email"}
          </Button>
        </div>
      </Card>
    );
  }

  const goToDetails = async () => {
    if (await methods.trigger(["email", "password"])) setStep(2);
  };

  return (
    <Card className={AUTH_CARD}>
      <ThemeToggle className="absolute right-0 top-0 m-0 max-sm:right-5 max-sm:top-5 lg:right-0 lg:top-0" />

      <div className="space-y-4">
        {/* progress: two short steps instead of one long form */}
        <div className="flex items-center gap-3 pr-12">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="-ml-1 inline-flex items-center gap-1 text-sm text-text hover:text-card-text"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <span className="flex flex-1 gap-1.5" aria-hidden="true">
            <span className="h-1 flex-1 rounded-full bg-Green" />
            <span className={cn("h-1 flex-1 rounded-full", step === 2 ? "bg-Green" : "bg-border")} />
          </span>
          <span className="text-xs text-text">Step {step} of 2</span>
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-[30px] font-bold leading-9 tracking-[-0.03em] text-card-text sm:text-[34px] sm:leading-10">
            {step === 1 ? "Create your account" : "Tell us about you"}
          </h1>
          <p className="text-[15px] leading-6 text-text">
            {step === 1
              ? "Start with the email you’ll sign in with."
              : "Use your name exactly as it is on your BVN, so verification goes through first time."}
          </p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <Button
            onClick={() => loginWithGoogle("signup")}
            variant="outline"
            className={cn(AUTH_BUTTON, "text-card-text")}
          >
            <Image width={18} height={18} alt="" src="/googleIcon.svg" unoptimized />
            Sign up with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-placeholder">
            <span className="h-px flex-1 bg-border" />
            or with email
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-5 max-sm:flex max-sm:flex-1 max-sm:flex-col max-sm:space-y-0 max-sm:gap-5"
        >
          {step === 1 ? (
            <>
              <FormField
                id="email"
                label="Email"
                placeholder="you@example.com"
                icon={Mail}
                register={methods.register}
                error={methods.formState.errors.email}
                className={AUTH_FIELD}
              />
              <PasswordField
                id="password"
                label="Create a password"
                placeholder="At least 8 characters"
                icon={Lock}
                register={methods.register}
                error={methods.formState.errors?.password}
                className={cn(AUTH_FIELD, "[&_input]:pr-12")}
              />
              <Button
                type="button"
                onClick={goToDetails}
                className={cn(AUTH_BUTTON, "max-sm:mt-auto")}
              >
                Continue
              </Button>
              <p className="text-center text-sm text-text">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-Green hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  id="firstName"
                  label="First name"
                  placeholder="First name"
                  icon={User}
                  register={methods.register}
                  error={methods.formState.errors.firstName}
                  className={AUTH_FIELD}
                />
                <FormField
                  id="lastName"
                  label="Last name"
                  placeholder="Last name"
                  icon={User}
                  register={methods.register}
                  error={methods.formState.errors.lastName}
                  className={AUTH_FIELD}
                />
              </div>
              <FormField
                id="dateOfBirth"
                label="Date of birth"
                placeholder="Date of birth"
                type="date"
                icon={Calendar}
                register={methods.register}
                error={methods.formState.errors.dateOfBirth}
                className={AUTH_FIELD}
              />
              <FormField
                id="phoneNumber"
                label="Phone number"
                placeholder="0803 123 4567"
                type="tel"
                icon={Phone}
                register={methods.register}
                error={methods.formState.errors.phoneNumber}
                className={AUTH_FIELD}
              />
              <fieldset className="space-y-2">
                <legend className="text-[13px] font-medium leading-5 text-card-text">Gender</legend>
                <div className="grid grid-cols-3 gap-3">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      aria-pressed={gender === g.value}
                      onClick={() =>
                        methods.setValue("gender", g.value, { shouldValidate: true, shouldDirty: true })
                      }
                      className={cn(
                        "h-12 rounded-md border text-[15px] transition-colors max-sm:h-13",
                        gender === g.value
                          ? "border-Green bg-teal-light font-semibold text-teal-text"
                          : "border-input bg-input-background text-card-text hover:border-border-active/60",
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                <ErrorField message={methods.formState.errors.gender?.message} />
              </fieldset>
              <SelectField
                id="country"
                label="Country of residence"
                placeholder="Select your country"
                icon={Globe}
                options={countryOptions}
                register={methods.register}
                error={methods.formState.errors.country}
                className={AUTH_FIELD}
              />
              {showReferral ? (
                <FormField
                  id="referral"
                  label="Referral code"
                  placeholder="Optional"
                  register={methods.register}
                  className={cn(AUTH_FIELD, "[&_input]:pl-4")}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReferral(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-Green hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Have a referral code?
                </button>
              )}
              <ErrorLayout message={error?.message} />
              <Button
                type="submit"
                disabled={!isValid}
                variant={isPending ? "disabled" : isValid ? "default" : "disabled"}
                className={cn(AUTH_BUTTON, "max-sm:mt-auto")}
              >
                {isPending ? "Creating account…" : "Create account"}
              </Button>
            </>
          )}
        </form>
      </FormProvider>

      <p className="text-center text-xs leading-5 text-placeholder">
        By creating an account you agree to our <span className="text-Green">Terms of Service</span> and{" "}
        <PrivacyPolicyLink />.
      </p>
    </Card>
  );
};

export default SignUp;
