import { Button } from "@/components/ui/button";
import { AvatarCircle } from "./avatarCircle";
import { Input } from "@/components/ui/input";
import { StepIndicator } from "./stepIndicator";
import { NIGERIAN_BANKS } from "./mockData";
import { useState } from "react";
import { Recipient } from "./types";
import { SelectField } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BankAccountStep({
  onBack,
  onFound,
  onNotFound,
}: {
  onBack: () => void;
  onFound: (r: Recipient) => void;
  onNotFound: () => void;
}) {
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
 
  // Simulate account resolution when both fields are filled
  const handleAccountChange = (val: string) => {
    setAccountNumber(val);
    setResolvedName(null);
    setError(false);
 
    if (val.length === 10 && bank) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Simulate: accounts starting with 0 resolve, others fail
        if (val.startsWith("0")) {
          setResolvedName("John Doe");
        } else {
          setError(true);
        }
      }, 800);
    }
  };
 
  const handleBankChange = (val: string) => {
    setBank(val);
    setResolvedName(null);
    setError(false);
 
    if (accountNumber.length === 10 && val) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (accountNumber.startsWith("0")) {
          setResolvedName("John Doe");
        } else {
          setError(true);
        }
      }, 800);
    }
  };
 
  const selectedBankLabel = NIGERIAN_BANKS.find((b) => b.value === bank)?.label ?? "";
 
  return (
    <div className="px-8 pb-8 pt-4 space-y-5">
 
      <div className="space-y-2">
        <label className="text-sm font-medium text-card-text">Account Number</label>
        <Input
          placeholder="Enter Account Number"
          maxLength={10}
          value={accountNumber}
          onChange={(e) => handleAccountChange(e.target.value.replace(/\D/g, ""))}
          className={cn(
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          )}
        />
      </div>
 
      <div className="space-y-2">
        <label className="text-sm font-medium text-card-text">Bank Name</label>
        <SelectField
          id="bank"
          placeholder="Select Bank"
          options={NIGERIAN_BANKS}
          register={() => ({
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => handleBankChange(e.target.value),
            value: bank,
            name: "bank",
            ref: () => {},
            onBlur: () => {},
          })}
        />
      </div>
 
      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-text animate-pulse">
          <div className="w-4 h-4 rounded-full border-2 border-Green border-t-transparent animate-spin" />
          Resolving account...
        </div>
      )}
 
      {/* Resolved name */}
      {resolvedName && !loading && (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-Green/30 bg-Green/5">
          <AvatarCircle name={resolvedName} color="bg-orange-500" size="sm" />
          <div>
            <p className="text-sm font-medium text-card-text">{resolvedName}</p>
            <p className="text-xs text-text">{selectedBankLabel}</p>
          </div>
        </div>
      )}
 
      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-destructive/40 bg-destructive/10">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">
            Account not found. Please check the account number and selected bank.
          </p>
        </div>
      )}
 
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!resolvedName || loading}
          onClick={() =>
            onFound({
              id: accountNumber,
              name: resolvedName!,
              uid: accountNumber,
              bank: selectedBankLabel,
            })
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
}