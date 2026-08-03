"use client";

import { useState } from "react";
import Image from "next/image";
import { normaliseBankName } from "@/lib/actions/bank-logos";
import { useGetBankLogos } from "@/lib/services/bank-logos.service";
import { bankColor, bankInitials } from "@/lib/wallet-page";
import { cn } from "@/lib/utils";

/**
 * Renders a bank's logo, falling back to the coloured initials badge when the
 * bank has no artwork or the logo host is unreachable. The fallback is the
 * existing treatment, so this is purely additive.
 */
export function BankLogo({
  bankName,
  bankCode,
  size = 40,
  className,
}: {
  bankName: string;
  bankCode?: string;
  size?: number;
  className?: string;
}) {
  const { data: logos } = useGetBankLogos();

  // Track which logo failed rather than a boolean, so a different bank in the
  // same slot gets a fresh attempt instead of inheriting the previous failure.
  const [failedLogo, setFailedLogo] = useState<string | null>(null);

  const logo =
    (bankCode ? logos?.get(bankCode) : undefined) ??
    logos?.get(normaliseBankName(bankName));

  const failed = failedLogo !== null && failedLogo === logo;

  if (!logo || failed) {
    // Fewer initials as the badge shrinks, so small sizes stay legible rather
    // than cramming three glyphs into a 16px circle.
    const initialsCount = size < 20 ? 1 : size < 32 ? 2 : 3;

    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center shrink-0 text-white font-semibold uppercase",
          bankColor(bankName),
          className,
        )}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(8, Math.round(size * 0.36)),
        }}
      >
        {bankInitials(bankName).slice(0, initialsCount)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shrink-0 bg-white",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={logo}
        alt={bankName}
        width={size}
        height={size}
        className="h-full w-full object-contain"
        onError={() => setFailedLogo(logo)}
        unoptimized
      />
    </div>
  );
}
