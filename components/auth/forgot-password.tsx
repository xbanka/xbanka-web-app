"use client";

import { Card } from "../ui/FormCard";
import { FormHeader } from "../ui/FormHeader";
import { FormField } from "../ui/FormField";
import { Mail } from "lucide-react";
import {
  forgotPasswordData,
  forgotPasswordSchema,
  logInFormData,
  logInSchema,
} from "@/lib/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useForgotPassword, useLogin } from "@/lib/services/auth.service";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ErrorLayout } from "../ui/error-layout";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const methods = useForm<forgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isValid },
    reset,
  } = methods;

  const { error, mutate, isPending } = useForgotPassword();

  const onSubmit = (data: forgotPasswordData) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/reset-password");
        reset();
      },
    });
  };

  return (
    <Card className="space-y-6 max-sm:text-left">
      <ThemeToggle className="max-sm:absolute max-sm:right-5 max-sm:top-5 max-sm:m-0" />
      <FormHeader className="max-sm:text-left" title="Forgot Password" />
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
          <ErrorLayout message={error?.message} />
        </div>
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
          By creating an account, you agree to our{" "}
          <span className="text-Green">Terms of Service</span> &{" "}
          <span className="text-Green">Privacy Policy</span>
        </p>
      </div>
    </Card>
  );
};

export default ForgotPassword;
