"use client";

import { Card } from "../ui/FormCard";
import { FormHeader } from "../ui/FormHeader";
import Link from "next/link";
import { FormField } from "../ui/FormField";
import { Lock, Mail } from "lucide-react";
import {
  logInFormData,
  logInSchema
} from "@/lib/schema/auth-schema";
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

const SignIn = () => {
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
  console.log(error);

  const onSubmit = (data: logInFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
      onError: (err: any) => {
        if (err?.raw?.response?.data?.errorGroup === "EMAIL_VERIFICATION_REQUIRED") {
          setUserEmail(data.email);
          setShowVerifyEmail(true);
          resendMutate(data.email);
          setCountdown(60);
        }
      }
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

  return (
    <Card className="space-y-6 max-sm:text-left">
      <ThemeToggle className="max-sm:absolute max-sm:right-5 max-sm:top-5 max-sm:m-0" />
      <FormHeader
        className="max-sm:text-left"
        title="Welcome to XBanka"
        subtitle={
          <span className="max-sm:text-[14px]">
            <span>Don&apos;t have an account? </span>

            <Link className="text-Green max-sm:text-[14px]" href="/sign-up">
              Sign up
            </Link>
          </span>
        }
      />
      <div className="space-y-3">
        <Button
          onClick={loginWithGoogle}
          variant="outline"
          className="p-2 w-full max-sm:h-14 max-sm:rounded-lg max-sm:text-base"
        >
          <Image width={20} height={20} alt="google" src="/googleIcon.svg" />
          Sign in with Google
        </Button>
        <div className="flex items-center gap-4 text-text">
          <span className="h-0.5 w-full bg-border"></span>
          <span>OR</span>
          <span className="h-0.5 w-full bg-border"></span>
        </div>
      </div>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-4 max-sm:flex max-sm:flex-1 max-sm:flex-col max-sm:space-y-0"
      >
        <div className="space-y-4">
          <FormField
            id="email"
            placeholder="Email"
            icon={Mail}
            register={methods.register}
            error={methods.formState.errors.email}
            className="[&_input]:max-sm:h-14 [&_input]:max-sm:rounded-lg [&_input]:max-sm:pl-12 [&_input]:max-sm:text-base [&_svg]:max-sm:h-5 [&_svg]:max-sm:w-5"
          />
          <PasswordField
            id="password"
            placeholder="Password"
            icon={Lock}
            register={methods.register}
            error={methods.formState.errors?.password}
            className="[&_input]:max-sm:h-14 [&_input]:max-sm:rounded-lg [&_input]:max-sm:pl-12 [&_input]:max-sm:pr-12 [&_input]:max-sm:text-base [&_svg]:max-sm:h-5 [&_svg]:max-sm:w-5"
          />
          <ErrorLayout message={error?.message} />
        </div>
        <Link href="/forgot-password" className="text-Green text-sm w-fit flex justify-start">Forgot Password?</Link>
        <Button
          type="submit"
          size={"lg"}
          disabled={!isValid}
          variant={isPending ? "disabled" : isValid ? "default" : "disabled"}
          className="w-full max-sm:mt-auto max-sm:h-14 max-sm:rounded-lg max-sm:text-base"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="px-30 text-center max-sm:px-0">
        <p className="font-normal text-[14px] leading-6 max-sm:text-base max-sm:leading-7">
          By signing into your account, you agree to our{" "}
          <span className="text-Green">Terms of Service</span> &{" "}
          <span className="text-Green">Privacy Policy</span>
        </p>
      </div>
    </Card>
  );
};

export default SignIn;
