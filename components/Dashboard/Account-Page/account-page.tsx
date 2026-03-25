"use client"
import { useState } from "react";
import { AccountInfoTab } from "./account-info-tab";
import { IdentityVerificationTab } from "./identity-verification-tab";
import { SecurityTab } from "./security-tab";

export default function AccountPage() {
  const [tab, setTab] = useState<AccountTab>("info");
  const tabs: { id: AccountTab; label: string }[] = [
    { id: "info", label: "Account Info" },
    { id: "security", label: "Security" },
    { id: "identity", label: "Identity Verification" },
  ];
 
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-card-text">Account</h1>
 
      {/* Sub-nav tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pb-2.5 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px
              ${tab === t.id ? "border-Green text-Green" : "border-transparent text-text hover:text-card-text"}`}>
            {t.label}
          </button>
        ))}
      </div>
 
      {tab === "info" && <AccountInfoTab />}
      {tab === "security" && <SecurityTab />}
      {tab === "identity" && <IdentityVerificationTab />}
    </div>
  );
}