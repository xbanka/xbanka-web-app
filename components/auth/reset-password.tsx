"use client";

import { Card } from "../ui/FormCard";
import { FormHeader } from "../ui/FormHeader";
import Link from "next/link";
import { FormField } from "../ui/FormField";
import { Lock, Mail, Phone } from "lucide-react";
import {
  logInFormData,
  logInSchema,
  resetPasswordData,
  resetPasswordSchema,
} from "@/lib/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import PasswordField from "../ui/password-field";
import { useResetPassword } from "@/lib/services/auth.service";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ErrorLayout } from "../ui/error-layout";
import { useEffect, useState } from "react";
import { ForgotPasswordSuccessState } from "./forgot-password-success-state";
import { useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const [step, setStep] = useState<"form" | "success">("form");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const methods = useForm<resetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email,
      password: "",
      confirm_password: "",
      otp: "",
    },
  });

  const {
    formState: { isValid },
    reset,
  } = methods;

  const { error, mutate, isPending } = useResetPassword();

  const onSubmit = (data: resetPasswordData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setStep("success");
      },
    });
  };

  useEffect(() => {
    if (email) {
      methods.setValue("email", email);
    }
  }, [email, methods]);

  return (
    <Card className="space-y-6 max-sm:text-left">
      <ThemeToggle className="max-sm:absolute max-sm:right-5 max-sm:top-5 max-sm:m-0" />

      {step === "form" && (
        <>
          <FormHeader
            className="max-sm:text-left"
            title="Reset your XBanka password"
            subtitle="An OTP has been sent to your mail"
          />

          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 max-sm:flex max-sm:flex-1 max-sm:flex-col max-sm:space-y-0"
          >
            <div className="space-y-4">
              <FormField
                id="otp"
                placeholder="OTP"
                icon={Phone}
                register={methods.register}
                error={methods.formState.errors.otp}
                className="[&_input]:max-sm:h-14 [&_input]:max-sm:rounded-lg [&_input]:max-sm:pl-12 [&_input]:max-sm:text-base [&_svg]:max-sm:h-5 [&_svg]:max-sm:w-5"
              />

              {/* <FormField
                id="email"
                placeholder="Email"
                icon={Mail}
                register={methods.register}
                error={methods.formState.errors.email}
                className="[&_input]:max-sm:h-14 [&_input]:max-sm:rounded-lg [&_input]:max-sm:pl-12 [&_input]:max-sm:text-base [&_svg]:max-sm:h-5 [&_svg]:max-sm:w-5"
              /> */}

              <PasswordField
                id="password"
                placeholder="New Password"
                icon={Lock}
                register={methods.register}
                error={methods.formState.errors?.password}
                className="[&_input]:max-sm:h-14 [&_input]:max-sm:rounded-lg [&_input]:max-sm:pl-12 [&_input]:max-sm:pr-12 [&_input]:max-sm:text-base [&_svg]:max-sm:h-5 [&_svg]:max-sm:w-5"
              />

              <PasswordField
                id="confirm_password"
                placeholder="Confirm Password"
                icon={Lock}
                register={methods.register}
                error={methods.formState.errors?.confirm_password}
                className="[&_input]:max-sm:h-14 [&_input]:max-sm:rounded-lg [&_input]:max-sm:pl-12 [&_input]:max-sm:pr-12 [&_input]:max-sm:text-base [&_svg]:max-sm:h-5 [&_svg]:max-sm:w-5"
              />

              <ErrorLayout message={error?.message} />
            </div>

            <Button
              type="submit"
              size={"lg"}
              disabled={!isValid || isPending}
              variant={isPending || !isValid ? "disabled" : "default"}
              className="w-full max-sm:mt-auto max-sm:h-14 max-sm:rounded-lg max-sm:text-base"
            >
              {isPending ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="px-30 text-center max-sm:px-0">
            <p className="font-normal text-[14px] leading-6 max-sm:text-base max-sm:leading-7">
              By creating an account, you agree to our{" "}
              <span className="text-Green">Terms of Service</span> &{" "}
              <span className="text-Green">Privacy Policy</span>
            </p>
          </div>
        </>
      )}

      {step === "success" && (
        <ForgotPasswordSuccessState
          title="Password Reset Successful"
          subtitle="Your password has been updated successfully. You can now log in with your new password."
          badge="verified"
          ctaLabel="Continue to Login"
          onCta={() => {
            window.location.href = "/sign-in";
          }}
          onClose={() => {
            window.location.href = "/sign-in";
          }}
        />
      )}
    </Card>
  );
};

export default ResetPassword;
