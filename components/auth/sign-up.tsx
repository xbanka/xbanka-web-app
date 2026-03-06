"use client";
import React from "react";
import { Card } from "../ui/Card";
import { FormHeader } from "../ui/FormHeader";
import Link from "next/link";
import { FormField } from "../ui/FormField";
import { Lock, Mail } from "lucide-react";
import { LoginFormData, loginSchema } from "@/lib/schema/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import PasswordField from "../ui/password-field";
import Image from "next/image";

const SignUp = () => {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    // TODO: implement sign up logic
    console.log("sign up data:", data);
  };

  // if (showSuccess && isSuccess && data?.success) {
  if (true) {
    return (
      <Card className="">
        <div className="text-center space-y-6">
          <div className="relative h-24 w-32.25 flex items-center justify-center mx-auto">
            <Image src={"/mail.svg"} alt="mail" className="" fill/>
          </div>
          <div className="space-y-4">
            <h2 className="text-[36px] leading-11 font-bold text-card-text">
              Verify your email address
            </h2>
            <p className="font-normal leading-6 text-[16px] text-text px-7">
              We sent a verification link to eyebiokinjoseph1@gmail.com
              Check your inbox or spam to verify your account
            </p>
          </div>
          <Link href="">
            <Button type="submit" className="w-full p-2.5">
              Ok
            </Button>
          </Link>
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
      <div>
        <Button variant="outline" className="p-2 w-full bg-transparent">
          Google sign up text
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
          <Button type="submit" variant={"disabled"} className="w-full p-2.5">
            Sign Up
          </Button>
        </form>
      </FormProvider>
      <div>
        <p className="font-normal text-[14px] leading-3.5">
          By creating an account, you agree to our{" "}
          <span className="text-Green">Terms of Service</span> &{" "}
          <span className="text-Green">Privacy</span>
          Policy
        </p>
      </div>
    </Card>
  );
};

export default SignUp;
