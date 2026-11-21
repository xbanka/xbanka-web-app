"use client";

import { Card } from "../ui/FormCard";
import Link from "next/link";
import { FormField } from "../ui/FormField";
import { Lock, Mail } from "lucide-react";
import { logInFormData, logInSchema } from "@/lib/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import PasswordField from "../ui/password-field";
import Image from "next/image";
import { useLogin, useResendVerifyMail } from "@/lib/services/auth.service";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ErrorLayout } from "../ui/error-layout";
import { useState, useEffect } from "react";
import { maskEmail } from "@/lib/maskEmail";
import MailPic from "../../public/mail.svg";
import { useRouter } from "next/navigation";
import { PrivacyPolicyLink } from "@/components/legal/privacy-policy-link";
import { cn } from "@/lib/utils";
import { AUTH_BUTTON, AUTH_CARD, AUTH_FIELD } from "./auth-styles";

const SignIn = ({ urlError }: { urlError?: string }) => {
  const router = useRouter();
  const isNoAccountError = urlError?.toLowerCase().includes("no account belongs to this google");
  const { loginWithGoogle } = useGoogleAuth();
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  const {
    mutate: resendMutate,
    isPending: resendPending,
    error: resendError,
  } = useResendVerifyMail();
  const methods = useForm<logInFormData>({
    resolver: zodResolver(logInSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isValid },
    reset,
  } = methods;

  const { error, mutate, isPending } = useLogin();

  const onSubmit = (data: logInFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        if (
          err?.raw?.response?.data?.errorGroup === "EMAIL_VERIFICATION_REQUIRED"
        ) {
          setUserEmail(data.email);
          setShowVerifyEmail(true);
          resendMutate(data.email);
          setCountdown(60);
        }
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

  if (showVerifyEmail) {
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
          <ErrorLayout message={resendError?.message} />
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

  if (isNoAccountError) {
    return (
      <Card className="space-y-6 text-center">
        <ThemeToggle className="max-sm:absolute max-sm:right-5 max-sm:top-5 max-sm:m-0" />
        <div className="pt-4 space-y-4">
          <h2 className="text-2xl font-bold text-card-text">Account Not Found</h2>
          <p className="text-text">
            {urlError}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.push("/sign-in")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => loginWithGoogle("signup")}
              className="flex-1"
            >
              Sign Up with Google
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={AUTH_CARD}>
      <ThemeToggle className="absolute right-0 top-0 m-0 max-sm:right-5 max-sm:top-5 lg:right-0 lg:top-0" />
      <div className="space-y-2">
        <h1 className="font-display text-[30px] font-bold leading-9 tracking-[-0.03em] text-card-text sm:text-[34px] sm:leading-10">
          Welcome back
        </h1>
        <p className="text-[15px] text-text">Sign in to your Xbanka account.</p>
      </div>

      <div className="space-y-5">
        <Button
          onClick={() => loginWithGoogle("signin")}
          variant="outline"
          className={cn(AUTH_BUTTON, "text-card-text")}
        >
          <Image width={18} height={18} alt="" src="/googleIcon.svg" unoptimized />
          Continue with Google
        </Button>
        <div className="flex items-center gap-3 text-xs text-placeholder">
          <span className="h-px flex-1 bg-border" />
          or with email
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>

      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-5 max-sm:flex max-sm:flex-1 max-sm:flex-col max-sm:space-y-0 max-sm:gap-5"
      >
        <FormField
          id="email"
          label="Email"
          placeholder="you@example.com"
          icon={Mail}
          register={methods.register}
          error={methods.formState.errors.email}
          className={AUTH_FIELD}
        />
        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Password"
            placeholder="Your password"
            icon={Lock}
            register={methods.register}
            error={methods.formState.errors?.password}
            className={cn(AUTH_FIELD, "[&_input]:pr-12")}
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-medium text-Green hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <ErrorLayout message={error?.message} />
        <Button
          type="submit"
          disabled={!isValid}
          variant={isPending ? "disabled" : isValid ? "default" : "disabled"}
          className={cn(AUTH_BUTTON, "max-sm:mt-auto")}
        >
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-text">
          New to Xbanka?{" "}
          <Link href="/sign-up" className="font-semibold text-Green hover:underline">
            Create an account
          </Link>
        </p>
      </form>

      <p className="text-center text-xs leading-5 text-placeholder">
        By signing in you agree to our <span className="text-Green">Terms of Service</span> and{" "}
        <PrivacyPolicyLink />.
      </p>
    </Card>
  );
};

export default SignIn;
