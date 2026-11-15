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
import { useQueryClient } from "@tanstack/react-query";
import {
  classifyTrustedWalletError,
  networkName,
  TrustedWallet,
} from "@/lib/trusted-wallets";
import {
  TRUSTED_WALLETS_KEY,
  UseTrustedWalletsSupported,
} from "@/lib/services/trusted-wallets.service";
import { CoolingOffModal } from "../TrustedWallets/cooling-off-modal";

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
  const [trustedWallet, setTrustedWallet] = useState<TrustedWallet | null>(
    null,
  );
  // Held only between the PIN screen and the withdraw call.
  const [pin, setPin] = useState("");
  const [coolingOff, setCoolingOff] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [successDetails, setSuccessDetails] =
    useState<WalletSuccessState | null>(null);
  const [recipientType, setRecipientType] = useState<
    "trusted-wallet" | "xbanka-user"
  >("trusted-wallet");
  const queryClient = useQueryClient();
  const { data: supported } = UseTrustedWalletsSupported();

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
    setTrustedWallet(null);
    setPin("");
    setCoolingOff(null);
    setAmount("");
    setXbankaRecipient(null);
    setRecipientType("trusted-wallet");
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

  const isTrusted = recipientType === "trusted-wallet";

  if (coolingOff !== null && trustedWallet)
    return (
      <CoolingOffModal
        label={trustedWallet.label}
        unlocksAt={coolingOff || trustedWallet.unlocksAt}
        onClose={() => {
          setCoolingOff(null);
          setStep("recipient");
        }}
      />
    );

  if (step === "recipient")
    return (
      <RecipientStep
        currency={selectedAssetId?.currency}
        selectedWalletId={trustedWallet?.id}
        onBack={() => setStep("select_asset")}
        onClose={handleClose}
        onNext={(data) => {
          setRecipientType(data.type);

          // A saved wallet fixes the network, so that step is skipped.
          if (data.type === "trusted-wallet" && data.wallet) {
            setTrustedWallet(data.wallet);
            setSelectedNetworkId(data.wallet.network);
            setStep("enter_amount");
          }

          if (data.type === "xbanka-user") {
            setXbankaRecipient(data.user || null);
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
        onBack={() => setStep(isTrusted ? "recipient" : "select_network")}
        onClose={handleClose}
        onNext={() => setStep("confirm")}
        skipNetwork={isTrusted}
      />
    );

  if (step === "confirm")
    return (
      <ConfirmStep
        amount={amount}
        asset={selectedAssetId}
        network={selectedNetworkId}
        recipientAddress={trustedWallet?.address ?? ""}
        recipientName={trustedWallet?.label}
        networkLabel={
          isTrusted ? networkName(trustedWallet?.network, supported) : undefined
        }
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
        onConfirm={(value) => {
          setPin(value);
          setStep("processing");
        }}
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
        onConfirm={() => {
          setPin("");
          setStep("success");
        }}
        amount={amount}
        asset={selectedAssetId}
        trustedWalletId={trustedWallet?.id ?? ""}
        pin={pin}
        onError={(error) => {
          setPin("");
          const action = classifyTrustedWalletError(error);
          if (action.kind === "cooling-off") {
            queryClient.invalidateQueries({ queryKey: TRUSTED_WALLETS_KEY });
            setCoolingOff(action.unlocksAt);
            return;
          }
          if (action.kind === "pick-saved-wallet" || action.kind === "refetch") {
            queryClient.invalidateQueries({ queryKey: TRUSTED_WALLETS_KEY });
            setTrustedWallet(null);
            setStep("recipient");
            return;
          }
          setProcessingError(action.message);
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
        // A trusted send needs the PIN again: it is not kept after a failure.
        onRetry={() => setStep(isTrusted ? "enter_pin" : "processing")}
        errorMessage={processingError ? `${processingError}` : ""}
      />
    );
  }

  return null;
}
