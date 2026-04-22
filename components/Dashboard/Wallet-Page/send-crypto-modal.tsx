import { useState } from "react";
import { ConfirmStep } from "./confirm-stepp";
import { EnterAmountStep } from "./enter-amount-step";
import { EnterPinStep } from "./enter-pin-stepp";
import { ProcessingStep } from "./processing-stepp";
import { SelectNetworkStep } from "./select-network-step";
import { SuccessStep } from "./success-stepp";
import { SendCryptoModalProps, SendStep } from "./types";
import { ASSETS, NETWORKS } from "./wallet-mock-data";
import { RecipientStep } from "./receipient-step";
import { SelectAssetStep } from "./select-asset-step";

export function SendCryptoModal({ open, onClose, onSuccess }: SendCryptoModalProps) {
  const [step, setStep] = useState<SendStep>("processing");
  const [selectedAssetId, setSelectedAssetId] = useState("btc");
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>("trc20");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientName, setRecipientName] = useState<string | undefined>();
  const [amount, setAmount] = useState("");
 
  if (!open) return null;
 
  const asset = ASSETS.find((a) => a.id === selectedAssetId) ?? ASSETS[0];
  const allNetworks = NETWORKS[selectedAssetId] ?? [];
  const network = allNetworks.find((n) => n.id === selectedNetworkId) ?? allNetworks[0];
  const mockTxHash = "TRX89c2d4e8f1294b2KL9";
 
  const reset = () => {
    setStep("select_asset");
    setSelectedAssetId("btc");
    setSelectedNetworkId(null);
    setRecipientAddress("");
    setRecipientName(undefined);
    setAmount("");
  };
 
  const handleClose = () => { reset(); onClose(); };
 
  const startProcessing = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2500));
    setStep("success");
  };
 
  if (step === "select_asset") return (
    <SelectAssetStep selectedId={selectedAssetId} onSelect={setSelectedAssetId}
      onClose={handleClose} onNext={() => setStep("recipient")} />
  );
 
  if (step === "recipient") return (
    <RecipientStep onBack={() => setStep("select_asset")} onClose={handleClose}
      onNext={(addr, name) => { setRecipientAddress(addr); setRecipientName(name); setStep("select_network"); }} />
  );
 
  if (step === "select_network") return (
    <SelectNetworkStep asset={asset} selectedNetworkId={selectedNetworkId}
      onNetworkChange={setSelectedNetworkId}
      onBack={() => setStep("recipient")} onClose={handleClose}
      onNext={() => setStep("enter_amount")} />
  );
 
  if (step === "enter_amount") return (
    <EnterAmountStep asset={asset} network={network} amount={amount} setAmount={setAmount}
      onBack={() => setStep("select_network")} onClose={handleClose}
      onNext={() => setStep("confirm")} />
  );
 
  if (step === "confirm") return (
    <ConfirmStep amount={amount} asset={asset} network={network}
      recipientAddress={recipientAddress} recipientName={recipientName}
      onBack={() => setStep("enter_amount")} onClose={handleClose}
      onNext={() => setStep("enter_pin")} />
  );
 
  if (step === "enter_pin") return (
    <EnterPinStep onBack={() => setStep("confirm")} onClose={handleClose}
      onConfirm={startProcessing} />
  );
 
  if (step === "processing") return (
    <ProcessingStep amount={amount} asset={asset} network={network}
      recipientName={recipientName} recipientAddress={recipientAddress} />
  );
 
  if (step === "success") return (
    <SuccessStep amount={amount} asset={asset} network={network} txHash={mockTxHash}
      onDone={() => { onSuccess?.(); handleClose(); }}
      onViewHistory={() => { handleClose(); /* navigate to transactions */ }} />
  );
 
  return null;
}
 
 