"use client";
import { useState } from "react";
import { Download, Eye, EyeOff, RefreshCcw, Send } from "lucide-react";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { UseGetCryptoWallet } from "@/lib/services/wallet.service";
import { sumCryptoBalance, sumCryptoFiatEquivalent } from "@/lib/sumBalances";
import { SendCryptoModal } from "../SendCryptoModal/send-crypto-modal";
import { DepositSidebar } from "./deposit-crypto-sidebar";
import { UseProfileUser } from "@/lib/services/profile.service";
import { CreatePinModal } from "../Account-Page/create-pin-modal";
import { useRouter } from "next/navigation";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";

export const CryptoBalance = () => {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [sendCrptoModalOpen, setSendCrptoModalOpen] = useState(false);
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const [view, setView] = useState<"NGN" | "CRYPTO">("NGN");
  const { validateUser } = useOnboardingGuard();
  const { data } = UseGetCryptoWallet();
  const wallets = data?.data?.data || [];

  const latestWallet = wallets[0];

  const { data: profileData } = UseProfileUser();
  const hasTransactionPin = profileData?.data?.hasTransactionPin;
  console.log(hasTransactionPin);

  const handleSendCrypto = () => {
    const isAllowed = validateUser();

    if (!isAllowed) return;
    if (!hasTransactionPin) {
      setOpenCreatePin(true);
      return;
    }

    setSendCrptoModalOpen(true);
  };
  return (
    <div>
      <DashboardCard className="border-teal-border bg-teal-light max-sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-text text-xs mb-2 max-sm:text-sm">
              <span>Total Crypto Value</span>
              <button
                onClick={() => setHidden((h) => !h)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {hidden ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="break-all text-3xl sm:text-4xl font-bold max-sm:text-[32px] max-sm:leading-10">
                {hidden
                  ? "•••••••"
                  : view === "NGN"
                    ? `₦${sumCryptoFiatEquivalent(wallets).toLocaleString()}`
                    : `$${sumCryptoBalance(wallets).toLocaleString()}`}
              </p>
              <select
                value={view}
                onChange={(e) => setView(e.target.value as "NGN" | "CRYPTO")}
                className="bg-transparent text-white/60 text-xs outline-none max-sm:text-sm"
              >
                <option value="NGN">NGN</option>
                <option value="CRYPTO">USDT</option>
              </select>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-text text-xs font-normal leading-4.5">
                ≈ ${latestWallet?.balance ?? 0}
              </span>
              <span className="bg-text h-1.5 w-1.5 rounded-full"></span>
              <span className="text-[#A6F4C5] text-xs font-medium leading-5">
                + ₦{latestWallet?.fiatEquivalent?.amount ?? 0} today
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
            <Button
              size={"sm"}
              onClick={() => setAddFundsOpen(true)}
              className="flex h-12 min-w-0 flex items-center gap-1 px-2 text-xs transition-colors sm:h-10 sm:flex-row sm:px-3 sm:text-sm"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate font-medium">Deposit</span>
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="flex h-12 min-w-0 flex    items-center gap-1 px-2 text-xs transition-colors sm:h-10 sm:flex-row sm:px-3 sm:text-sm"
              onClick={handleSendCrypto}
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate font-medium">Send</span>
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => router.push("/crypto?tab=convert")}
              className="flex h-12 min-w-0 items-center gap-1 px-2 text-xs transition-colors sm:h-10 sm:flex-row sm:px-3 sm:text-sm"
            >
              <RefreshCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate font-medium">Convert</span>
            </Button>
          </div>
        </div>
      </DashboardCard>
      <DepositSidebar
        open={addFundsOpen}
        onClose={() => setAddFundsOpen(false)}
      />
      {sendCrptoModalOpen && (
        <SendCryptoModal
          open={sendCrptoModalOpen}
          onClose={() => setSendCrptoModalOpen(false)}
        />
      )}

      {openCreatePin && (
        <CreatePinModal
          open={openCreatePin}
          handleClose={() => setOpenCreatePin(false)}
        />
      )}
    </div>
  );
};
