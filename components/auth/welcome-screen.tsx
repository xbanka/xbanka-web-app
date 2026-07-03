"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/FormCard";
import Image from "next/image";

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-6 sm:min-h-screen">
      <Card className="w-full max-w-150 space-y-5 overflow-hidden sm:space-y-6 max-sm:min-h-[calc(100dvh-48px)] max-sm:justify-center max-sm:px-5 max-sm:py-6">
        {/* Logo */}
        <span className="text-[13px] font-bold tracking-wide text-card-text">
          <span className="text-Green">x</span>banka
        </span>

        {/* Card */}
        <div className="w-full rounded-2xl bg-card-background px-0 sm:px-[33.5px]">
          {/* Illustration area */}
          {/* <Image src={"/Content.svg"} alt="content" width={400} height={260} unoptimized /> */}
          <div className="mx-auto h-44 w-full max-w-100 rounded-tl-[20px] rounded-tr-[20px] border-x-6 border-t-6 border-input sm:h-65"></div>

          {/* Avatars */}
          <div className="relative flex h-14 w-full items-center justify-center min-[375px]:h-16 sm:h-18">
            <Image
              className="z-10 -mr-2.5 h-10 w-10 min-[375px]:-mr-3 min-[375px]:h-12 min-[375px]:w-12 sm:-mr-4 sm:h-16 sm:w-16"
              alt=""
              src="/Rectangle3.svg"
              width={64}
              height={64} unoptimized />
            <Image
              className="z-20 -mr-2.5 h-12 w-12 min-[375px]:-mr-3 min-[375px]:h-14 min-[375px]:w-14 sm:-mr-4 sm:h-20 sm:w-20"
              alt=""
              src="/Rectangle2.svg"
              width={80}
              height={80} unoptimized />
            <Image
              className="z-30 -mr-2.5 h-14 w-14 min-[375px]:-mr-3 min-[375px]:h-16 min-[375px]:w-16 sm:-mr-4 sm:h-[100px] sm:w-[100px]"
              alt=""
              src="/Rectangle1.svg"
              width={100}
              height={100} unoptimized />
            <Image
              className="z-40 -mr-2.5 h-14 w-14 min-[375px]:-mr-3 min-[375px]:h-16 min-[375px]:w-16 sm:-mr-4 sm:h-[100px] sm:w-[100px]"
              alt=""
              src="/Rectangle.svg"
              width={100}
              height={100} unoptimized />
            <Image
              className="z-50 -mr-2.5 h-12 w-12 min-[375px]:-mr-3 min-[375px]:h-14 min-[375px]:w-14 sm:-mr-4 sm:h-20 sm:w-20"
              alt=""
              src="/Rectangle5.svg"
              width={80}
              height={80} unoptimized />
            <Image
              className="z-60 h-10 w-10 rounded-full min-[375px]:h-12 min-[375px]:w-12 sm:h-16 sm:w-16"
              alt=""
              src="/Rectangle4.svg"
              width={64}
              height={64} unoptimized />
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="text-[26px] font-bold leading-8 text-card-text min-[375px]:text-[30px] min-[375px]:leading-9 sm:text-[36px] sm:leading-11">
            Your financial future
            <br />
            starts here
          </h1>
          <p className="text-[15px] font-normal leading-6 text-text sm:text-[16px]">
            Your fiat and crypto wallet is ready.
            <br />
            Let&apos;s get started.
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="default"
          size="default"
          className="w-full"
          onClick={() => router.push("/")}
        >
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );
}
