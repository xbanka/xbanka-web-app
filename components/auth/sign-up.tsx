"use client";

import { Card } from "../ui/FormCard";
import { FormHeader } from "../ui/FormHeader";
import Link from "next/link";
import { FormField } from "../ui/FormField";
import { Lock, Mail } from "lucide-react";
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

const SignUp = () => {
  const [showSuccess, setShowSuccess] = useState(false);
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
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  const { data, error, mutate, isSuccess, isPending } = useSignup();
  console.log(error);

  const onSubmit = (data: SignupFormData) => {
    mutate(data, {
      onSuccess: () => {
        (reset(),
          setShowSuccess(true),
          setUserEmail(data.email),
          setCountdown(60));
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
          <Image src={"/mail.svg"} alt="mail" className="" fill />
        </div>
        <div className="space-y-4">
          <h2 className="text-[36px] leading-11 font-bold text-card-text">
            Verify your email address
          </h2>
          <p className="font-normal leading-6 text-[16px] text-text px-7">
            We sent a verification link to{" "}
            <strong className="text-text-border">{maskEmail(userEmail)}</strong>{" "}
            Check your inbox or spam to verify your account
          </p>
          <ErrorField message={resendError?.message} />
        </div>
        <Link href="/sign-in">
          <Button type="submit" className="w-full p-2.5">
            Ok
          </Button>
        </Link>
        <div className="text-center mt-6 font-normal leading-6 text-[16px] text-text">
          Did not get the email?{" "}
          <Button
            disabled={countdown > 0 || resendPending}
            onClick={handleResendVerification}
            className="w-full border-none bg-transparent text-blue-500 hover:bg-none"
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
    <Card className="space-y-6">
      <FormHeader
        title="Welcome to XBanka"
        subtitle={
          <>
            <span>Already have an account? </span>

            <Link className="text-Green" href="/sign-in">
              Login
            </Link>
          </>
        }
      />
      <div className="space-y-3">
        <Button
          onClick={loginWithGoogle}
          variant="outline"
          className="p-2 w-full"
        >
          <Image width={20} height={20} alt="google" src="/googleIcon.svg" />
          Sign up with Google
        </Button>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-full bg-border"></span>
          <span>OR</span>
          <span className="h-0.5 w-full bg-border"></span>
        </div>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            id="email"
            placeholder="Email"
            icon={Mail}
            register={methods.register}
            error={methods.formState.errors.email}
          />
          <PasswordField
            id="password"
            placeholder="Password"
            icon={Lock}
            register={methods.register}
            error={methods.formState.errors?.password}
          />
          <FormField
            id="referral"
            placeholder="Referral if any"
            register={methods.register}
          />
          <h1 className="text-error-text">{error?.message}</h1>
          <Button
            type="submit"
            size={"lg"}
            disabled={!isValid}
            variant={isPending ? "disabled" : isValid ? "default" : "disabled"}
            className="w-full"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </FormProvider>

      <div className="px-30 text-center">
        <p className="font-normal text-[14px] leading-6">
          By creating an account, you agree to our{" "}
          <span className="text-Green">Terms of Service</span> &{" "}
          <span className="text-Green">Privacy Policy</span>
        </p>
      </div>
    </Card>
  );
};

export default SignUp;
