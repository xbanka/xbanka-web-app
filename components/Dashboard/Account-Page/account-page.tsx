"use client";
import { useState } from "react";
import { AccountInfoTab } from "./account-info-tab";
import { IdentityVerificationTab } from "./identity-verification-tab";
import { SecurityTab } from "./security-tab";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "info";
  const tabs: { id: AccountTab; label: string }[] = [
    { id: "info", label: "Account Info" },
    { id: "security", label: "Security" },
    { id: "identity", label: "Identity Verification" },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Sub-nav tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => router.push(`/account?tab=${t.id}`)}
            className={`pb-2.5 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px
              ${currentTab === t.id ? "border-Green text-Green" : "border-transparent text-text hover:text-card-text"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {currentTab === "info" && <AccountInfoTab />}
      {currentTab === "security" && <SecurityTab />}
      {currentTab === "identity" && <IdentityVerificationTab />}
    </div>
  );
}
