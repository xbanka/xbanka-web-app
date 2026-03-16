"use client";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { Card } from "../ui/FormCard";
import Image from "next/image";
import { useVerifyMail } from "@/lib/services/auth.service";
import { useUserIdStore } from "@/store/verify-id.store";

const VerifyPage = ({ token }: { token?: string }) => {
  const { data, mutate, isSuccess, isPending, error, isError } =
    useVerifyMail();

  const hasVerified = React.useRef(false);
  const setUserId = useUserIdStore((s) => s.setUserId);

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;
    mutate(token);
  }, [mutate, token]);

  useEffect(() => {
    if (data?.data?.data?.id) {
      setUserId(data.data.data.id);
      console.log("User ID set in store:", data.data.data.id);
    }
  }, [data]);

  if (isSuccess && data?.success) {
    return (
      <Card className="text-center">
        <div className="relative h-24 w-32.25 flex items-center justify-center mx-auto">
          <Image src={"/mail.svg"} alt="mail" className="" fill />
        </div>
        <div className="space-y-4">
          <h2 className="text-[36px] leading-11 font-bold text-card-text">
            Let’s Get Started
          </h2>
          <p className="font-normal leading-6 text-[16px] text-text px-7">
            Your email has been verified successfully
          </p>
        </div>
        <Link href="/onboarding">
          <Button type="submit" className="w-full p-2.5">
            Continue
          </Button>
        </Link>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full mx-auto">
        <div className="relative h-24 w-32.25 flex items-center justify-center mx-auto">
          <Image src={"/mail.svg"} alt="mail" className="" fill />
        </div>
        <div className="space-y-4">
          <h2 className="text-[36px] leading-11 font-bold text-card-text">
            Verification Failed
          </h2>
          <p className="text-text text-[16px]">
            {error.message || "Invalid or expired token."}
          </p>
        </div>
        <Link href="/sign-up">
          <Button size="sm" className="w-full">
            Back to Signup
          </Button>
        </Link>
      </Card>
    );
  }

  if (isPending || (!isSuccess && !isError)) {
    return (
      <Card className="w-full mx-auto">
        <div className="relative h-24 w-32.25 flex items-center justify-center mx-auto">
          <Image src={"/mail.svg"} alt="mail" className="" fill />
        </div>
        <h2 className="text-[20px] font-bold text-card-text">
          Verifying your email...
        </h2>
        <p className="text-text text-[16px]">Please wait a moment.</p>
      </Card>
    );
  }
};

export default VerifyPage;
