import { useState } from "react";
import { ConfirmStep } from "./confirm-step";
import { EnterAmountStep } from "./enter-amount-step";
import { EnterPinStep } from "./enter-pin-step";
import { ProcessingStep } from "./processing-step";
import { SelectNetworkStep } from "./select-network-step";
import { SuccessStep } from "./success-step";
import {
  SendCryptoModalProps,
  SendStep,
  UserWallet,
} from "../Wallet-Page/types";
import { RecipientStep } from "./receipient-step";
import { SelectAssetStep } from "./select-asset-step";
import { WalletSuccessState } from "./crypto-modal-types";
import { FailedStep } from "./failed-step";
import { RecipientXbankaUsersTypes } from "./types";

export const CRYPTO_NETWORKS = {
  USDT: ["TRX", "ETH", "BSC", "SOL", "MATIC"],
  BTC: ["BTC"],
  ETH: ["ETH", "BSC"],
};

export function SendCryptoModal({
  open,
  onClose,
  onSuccess,
}: SendCryptoModalProps) {
  const [step, setStep] = useState<SendStep>("select_asset");
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<UserWallet | null>();
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientName, setRecipientName] = useState<string | undefined>();
  const [amount, setAmount] = useState("");
  const [successDetails, setSuccessDetails] =
    useState<WalletSuccessState | null>(null);
  const [recipientType, setRecipientType] = useState<
  "wallet" | "xbanka-user"
>("wallet");

const [xbankaRecipient, setXbankaRecipient] =
  useState<RecipientXbankaUsersTypes | null>(null);

  if (!open) return null;

  // const asset = ASSETS.find((a) => a.id === selectedAssetId) ?? ASSETS[0];
  // const allNetworks = NETWORKS[selectedAssetId] ?? [];
  // const network = allNetworks.find((n) => n.id === selectedNetworkId) ?? allNetworks[0];
  const mockTxHash = "TRX89c2d4e8f1294b2KL9";

  const reset = () => {
    setStep("select_asset");
    setSelectedAssetId(null);
    setSelectedNetworkId(null);
    setRecipientAddress("");
    setRecipientName(undefined);
    setAmount("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // const startProcessing = async () => {
  //   setStep("processing");
  //   await new Promise((r) => setTimeout(r, 2500));
  //   setStep("success");
  // };

  if (step === "select_asset")
    return (
      <SelectAssetStep
        selectedId={selectedAssetId}
        onSelect={setSelectedAssetId}
        onClose={handleClose}
        onNext={() => setStep("recipient")}
      />
    );

  if (step === "recipient")
    return (
      <RecipientStep
        onBack={() => setStep("select_asset")}
        onClose={handleClose}
        onNext={(addr, name) => {
          setRecipientAddress(addr);
          setRecipientName(name);
          setStep("select_network");
        }}
      />
    );

  if (step === "select_network")
    return (
      <SelectNetworkStep
        asset={selectedAssetId}
        selectedNetworkId={selectedNetworkId}
        onNetworkChange={setSelectedNetworkId}
        onBack={() => setStep("recipient")}
        onClose={handleClose}
        onNext={() => setStep("enter_amount")}
      />
    );

  if (step === "enter_amount")
    return (
      <EnterAmountStep
        asset={selectedAssetId}
        network={selectedNetworkId}
        amount={amount}
        setAmount={setAmount}
        onBack={() => setStep("select_network")}
        onClose={handleClose}
        onNext={() => setStep("confirm")}
      />
    );

  if (step === "confirm")
    return (
      <ConfirmStep
        amount={amount}
        asset={selectedAssetId}
        network={selectedNetworkId}
        recipientAddress={recipientAddress}
        recipientName={recipientName}
        onBack={() => setStep("enter_amount")}
        onClose={handleClose}
        onNext={() => setStep("enter_pin")}
      />
    );

  if (step === "enter_pin")
    return (
      <EnterPinStep
        onBack={() => setStep("confirm")}
        onClose={handleClose}
        onConfirm={() => setStep("processing")}
      />
    );

  if (step === "processing")
    return (
      <ProcessingStep
        setSuccessDetails={setSuccessDetails}
        onConfirm={() => setStep("success")}
        amount={amount}
        asset={selectedAssetId}
        network={selectedNetworkId}
        recipientName={recipientName}
        recipientAddress={recipientAddress}
        onError={(error) => {
          setProcessingError(error.message);
          setStep("failed");
        }}
      />
    );

  if (step === "success")
    return (
      <SuccessStep
        amount={amount}
        successDetails={successDetails}
        asset={selectedAssetId}
        network={selectedNetworkId}
        txHash={mockTxHash}
        onDone={() => {
          onSuccess?.();
          handleClose();
        }}
        onViewHistory={() => {
          handleClose(); /* navigate to transactions */
        }}
      />
    );

  if (step === "failed") {
    return (
      <FailedStep
        onClose={() => reset()}
        onRetry={() => setStep("processing")}
        errorMessage={processingError ? `${processingError}` : ""}
      />
    );
  }

  return null;
}
