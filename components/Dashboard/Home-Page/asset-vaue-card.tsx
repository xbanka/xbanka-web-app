"use client";

import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import {
  UseGetCryptoWallet,
  UseGetFiatWallet,
} from "@/lib/services/wallet.service";
import { sumCryptoFiatEquivalent, sumFiatBalances } from "@/lib/sumBalances";
import { Eye, EyeOff, HelpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { HowItWorksModal } from "./how-it-works-modal";

export function AssetValueCard() {
  const [hidden, setHidden] = useState(false);
  const [howItWorksModal, setHowItWorksModal] = useState(false);
  const [view, setView] = useState<"NGN" | "CRYPTO">("NGN");
  const {
    data: fiatData,
    error: fiatError,
    isPending: fiatIsPending,
  } = UseGetFiatWallet();
  const wallets = fiatData?.data?.data || [];
  const fiatBalance = sumFiatBalances(wallets);
  const {
    data: cryptoData,
    error: cryptoError,
    isPending: cryptoIsPending,
  } = UseGetCryptoWallet();
  const cryptoWallets = cryptoData?.data?.data || [];
  const cryptoBalance = sumCryptoFiatEquivalent(cryptoWallets);
  const cryptoEquivalent = sumFiatBalances(cryptoWallets);
  const totalBalance = fiatBalance + cryptoBalance;
  return (
    <DashboardCard className="border border-teal-border bg-teal-light">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-text text-sm">
            <span className="leading-6">Total Asset Value</span>
            <button
              onClick={() => setHidden((h) => !h)}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              {hidden ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            {(fiatIsPending || cryptoIsPending) && (
              <div className="text-sm text-card-text font-bold leading-11">
                Your balance might have changed
              </div>
            )}
            {!fiatIsPending && !cryptoIsPending && (
              <span className="text-3xl sm:text-4xl text-card-text font-bold leading-11">
                {hidden
                  ? "•••••••"
                  : view === "NGN"
                    ? `₦${totalBalance.toLocaleString()}`
                    : `$${"0".toLocaleString()}`}
              </span>
            )}
            {(fiatError || cryptoError) && (
              <ErrorField
                message={fiatError?.message || cryptoError?.message}
              />
            )}
            <select
              value={view}
              onChange={(e) => setView(e.target.value as "NGN" | "CRYPTO")}
              className="bg-transparent text-card-text/60 text-xs outline-none"
            >
              <option value="NGN">NGN</option>
              <option value="CRYPTO">USDT</option>
            </select>
          </div>
          <p className="text-text text-xs font-normal leading-4.5">
            {hidden
              ? "≈ ••••••"
              : `≈ $${cryptoEquivalent.toLocaleString()} USD`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            className="border border-input"
            onClick={() => setHowItWorksModal(true)}
          >
            <HelpCircle className="w-4 h-4" />
            How it works
          </Button>
        </div>
        {howItWorksModal && (
          <HowItWorksModal onClose={() => setHowItWorksModal(false)} />
        )}
      </div>
    </DashboardCard>
  );
}
