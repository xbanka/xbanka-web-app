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
import { ProcessingXbankaStep } from "./processing-xbanka-step";
import { SuccessStepXbanka } from "./success-step-xbanka";

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
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(
    null,
  );
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientName, setRecipientName] = useState<string | undefined>();
  const [amount, setAmount] = useState("");
  const [successDetails, setSuccessDetails] =
    useState<WalletSuccessState | null>(null);
  const [recipientType, setRecipientType] = useState<"wallet" | "xbanka-user">(
    "wallet",
  );

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
    setXbankaRecipient(null);
    setRecipientType("wallet");
    setProcessingError(null);
    setSuccessDetails(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
        onNext={(data) => {
          setRecipientType(data.type);

          if (data.type === "wallet") {
            setRecipientAddress(data.address || "");
            setRecipientName(data.name);
            setStep("select_network");
          }

          if (data.type === "xbanka-user") {
            setXbankaRecipient(data.user || null);

            // internal transfer skips network step
            setStep("select_network");
          }
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
        recipientType={recipientType}
        xbankaRecipient={xbankaRecipient}
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

  if (step === "processing") {
    if (recipientType === "xbanka-user" && xbankaRecipient) {
      return (
        <ProcessingXbankaStep
          amount={amount}
          recipient={xbankaRecipient}
          onConfirm={(response) => {
            const senderTx = response?.data?.transactions?.find(
              (tx: any) => tx.amount < 0,
            );

            setSuccessDetails({
              ...senderTx,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),

              // fallbacks for required fields
              id: senderTx?.reference || crypto.randomUUID(),
              walletId: "",
              network: "-",
              provider: "XBANKA",
              providerRef: senderTx?.reference || "",
              accountName: null,
              address: null,
              bankCode: null,
              bankName: null,
              memo: null,
              note: null,
              userId: "",
            });

            setStep("success");
          }}
          onError={(error) => {
            setProcessingError(error.message);
            setStep("failed");
          }}
        />
      );
    }
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
  }

  if (step === "success") {
    if (recipientType === "xbanka-user" && xbankaRecipient) {
      return (
        <SuccessStepXbanka
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
        // <p>ball</p>
      );
    }
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
  }

  if (step === "failed") {
    return (
      <FailedStep
        onClose={handleClose}
        onRetry={() => setStep("processing")}
        errorMessage={processingError ? `${processingError}` : ""}
      />
    );
  }

  return null;
}
