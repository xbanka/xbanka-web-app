"use client";

import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/FormCard";
import Image from "next/image";

const AVATARS = [
  { emoji: "🧕", bg: "#1b1d20" },
  { emoji: "👨‍🦱", bg: "#1b1d20" },
  { emoji: "🧔", bg: "#1b1d20" },
  { emoji: "🧑🏿", bg: "#1b1d20" },
  { emoji: "👩🏽", bg: "#1b1d20" },
];

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Card className="w-[600px] space-y-6">
        {/* Logo */}
        <span className="text-[13px] font-bold tracking-wide text-card-text">
          <span className="text-Green">x</span>banka
        </span>

        {/* Card */}
        <div className="w-full bg-card-background rounded-2xl px-[33.5px] flex flex-col items-center gap-5">
          {/* Illustration area */}
          {/* <Image src={"/Content.svg"} alt="content" width={400} height={260} /> */}
          <div className="h-[260px] w-100 border-t-6 border-x-6 border-input rounded-tl-[20px] rounded-tr-[20px]"></div>

          {/* Avatars */}
          <div className="flex items-center relative">
            <Image className="z-10" alt="" src={"/Rectangle3.svg"} width={64} height={64}/>
            <Image className="z-15 absolute left-9" alt="" src={"/Rectangle2.svg"} width={80} height={80}/>
            <Image className="z-20 absolute" alt="" src={"/Rectangle1.svg"} width={120} height={120}/>
            <Image className="z-30" alt="" src={"/Rectangle.svg"} width={120} height={120}/>
            <Image className="z-40" alt="" src={"/Rectangle5.svg"} width={80} height={80}/>
            <Image className="rounded-full z-50" alt="" src={"/Rectangle4.svg"} width={64} height={64}/>
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="text-[36px] font-bold text-card-text leading-11 tracking-tight">
            Your financial future
            <br />
            starts here
          </h1>
          <p className="text-[16px] font-normal leading-6 text-text">
            Your fiat and crypto wallet is ready.
            <br />
            Let's get started.
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="default"
          size="default"
          className="w-full"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );
}