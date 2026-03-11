"use client";

import { Card } from "../ui/Card";
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
import { useLogin, useSignup } from "@/lib/services/auth.service";
import { useState } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter;
  const { loginWithGoogle } = useGoogleAuth();
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

  const { error, mutate, isPending } = useLogin();
  console.log(error);

  const onSubmit = (data: SignupFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card className="space-y-6">
      <FormHeader
        title="Welcome to XBanka"
        subtitle={
          <>
            <span>Don't have an account? </span>

            <Link className="text-Green" href="/sign-up">
              Sign up
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
          Sign in with Google
        </Button>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-full bg-border"></span>
          <span>OR</span>
          <span className="h-0.5 w-full bg-border"></span>
        </div>
      </div>
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
        <h1 className="text-mainRed">{error?.message}</h1>
        <Button
          type="submit"
          size={"lg"}
          disabled={!isValid}
          variant={isPending ? "disabled" : isValid ? "default" : "disabled"}
          className="w-full"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>

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

export default SignIn;
