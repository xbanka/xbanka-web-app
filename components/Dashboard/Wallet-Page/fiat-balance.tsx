"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import {
  UseBankAccountList,
  UseGetFiatWallet,
} from "@/lib/services/wallet.service";
import { sumFiatBalances } from "@/lib/sumBalances";
import { Eye, EyeOff, Plus, Send } from "lucide-react";
import { useState } from "react";
import { AddFundsModal } from "../AddFundFiatModal/add-funds-modal";
import { SendMoneyModal } from "../SendFundFiatModal/send-money-modal";
import { UseProfileUser } from "@/lib/services/profile.service";
import { CreatePinModal } from "../Account-Page/create-pin-modal";
import { DisabledTooltipButton } from "@/components/ui/disabled-tooltip-button";
import { ErrorField } from "@/components/ui/field-error";

export const FiatBalance = () => {
  const [hidden, setHidden] = useState(false);
  const { data, error, isPending } = UseGetFiatWallet();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [sendFundsOpen, setSendFundsOpen] = useState(false);
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const wallets = data?.data?.data || [];
  const latestWallet = wallets?.[0];
  const { data: bankAccountList } = UseBankAccountList();
  const { data: profileData } = UseProfileUser();
  const hasTransactionPin = profileData?.data?.hasTransactionPin;
  const totalFiatBalance = sumFiatBalances(wallets);
  const isSendDisabled = totalFiatBalance <= 0;
  console.log(hasTransactionPin);

  const handleAddFund = () => {
    if (!hasTransactionPin) {
      setOpenCreatePin(true);
      return;
    }

    setAddFundsOpen(true);
  };

  const handleSendFund = () => {
    if (!hasTransactionPin) {
      setOpenCreatePin(true);
      return;
    }

    setSendFundsOpen(true);
  };

  return (
    <div>
      <DashboardCard className="border-[#004C99] bg-[#051D33]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-text text-[14px] leading-6 font-normal">
              <span>Available Balance</span>
              <button
                onClick={() => setHidden((h) => !h)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {hidden ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {isPending && (
              <div className="text-sm text-card-text font-bold leading-11">
                Your balance might have changed
              </div>
            )}
            {(!isPending && !error) && (
              <p className="text-3xl sm:text-4xl font-bold text-card-text">
                {hidden
                  ? "₦•••••••"
                  : data?.data
                    ? `₦${sumFiatBalances(wallets).toLocaleString()}`
                    : "₦0.00"}
            </p>)}
            {(error || !isPending) && (
              <ErrorField
                message={error?.message}
              />
            )}
            <span className="text-text text-xs font-normal leading-4.5">
              {isPending ? "Calculating..." : `≈ ₦${latestWallet?.balance ?? 0} today`}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="">
              <Button
                onClick={handleAddFund}
                variant={"default"}
                size={"sm"}
                className="flex items-center transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Fund
              </Button>
              {/* {isAddFundDisabled && (
                <span className="text-[10px] text-error-text">
                  Verify your bvn
                </span>
              )} */}
            </div>
            <DisabledTooltipButton
              disabled={isSendDisabled}
              tooltip="Add funds to continue"
            >
              <Button
                disabled={isSendDisabled}
                onClick={handleSendFund}
                variant={"outline"}
                size={"sm"}
                className="flex items-center transition-colors"
              >
                <Send className="w-5 h-5" />
                Send
              </Button>
            </DisabledTooltipButton>
          </div>
        </div>
        {addFundsOpen && (
          <AddFundsModal
            open={addFundsOpen}
            onClose={() => setAddFundsOpen(false)}
            onSuccess={() => setAddFundsOpen(false)}
          />
        )}
        {sendFundsOpen && (
          <SendMoneyModal
            onClose={() => setSendFundsOpen(false)}
            onBack={() => setSendFundsOpen(false)}
          />
        )}
        {openCreatePin && (
          <CreatePinModal
            open={openCreatePin}
            handleClose={() => setOpenCreatePin(false)}
          />
        )}
      </DashboardCard>
    </div>
  );
};
