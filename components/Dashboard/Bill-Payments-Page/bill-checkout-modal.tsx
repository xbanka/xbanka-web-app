"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Copy,
  LoaderCircle,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { ErrorLayout } from "@/components/ui/error-layout";
import { ResetPinModal } from "@/components/Layout/ResetPinModal";
import { cn } from "@/lib/utils";
import {
  useBillPaymentStatus,
  useConfirmBill,
  useDataPlans,
  useInitiateBill,
} from "@/lib/services/bills.service";
import {
  BillPayment,
  DataPlan,
  Disco,
  InitiateBillPayload,
  InitiateBillResponse,
  MeterType,
} from "@/lib/types/bills-types";
import { TransactionReceiptModal } from "@/components/ui/transaction-receipt-modal";
import { BillerLogo } from "./biller-logo";
import {
  discoBiller,
  ELECTRICITY_QUICK_AMOUNTS,
  formatNaira,
  networkBiller,
} from "./billers-data";
import { BillReceiptContext, buildBillReceipt } from "./bill-receipt";
import { DataPlanPicker, planKey } from "./data-plan-picker";

const MIN_AIRTIME = 50;
const MIN_ELECTRICITY = 500;
/** Stop polling a PENDING payment after this long; an in-app notification is
 *  sent when the status changes. */
const POLL_WINDOW_MS = 60 * 1000;

type Step = "details" | "review" | "pin" | "result";

const inputClasses =
  "w-full h-12 px-4 text-sm border border-input rounded-xl bg-input-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow]";

export function BillCheckoutModal({
  network,
  disco,
  onClose,
  onPayment,
}: {
  /** Airtime & data checkout for this network code. */
  network?: string;
  /** Electricity checkout for this disco. Exactly one of the two is set. */
  disco?: Disco;
  onClose: () => void;
  /** Called with the payment object on confirm and on every status update.
   *  `context` only comes with the confirm call — status updates reuse the
   *  context stored at insert. */
  onPayment: (payment: BillPayment, context?: BillReceiptContext) => void;
}) {
  const isElectricity = !!disco;
  const meta = disco
    ? discoBiller(disco.code, disco.name)
    : networkBiller(network as string);
  const providerName = disco?.name ?? meta?.name ?? network ?? "";

  const [step, setStep] = useState<Step>("details");
  const [product, setProduct] = useState<"AIRTIME" | "DATA">("AIRTIME");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [planId, setPlanId] = useState("");
  const [pin, setPin] = useState("");
  const [quote, setQuote] = useState<InitiateBillResponse | null>(null);
  const [payment, setPayment] = useState<BillPayment | null>(null);
  const [notice, setNotice] = useState("");
  const [openResetPin, setOpenResetPin] = useState(false);
  const [meterNumber, setMeterNumber] = useState("");
  const [meterType, setMeterType] = useState<MeterType>("PREPAID");
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const initiate = useInitiateBill();
  const confirm = useConfirmBill();
  const plans = useDataPlans(
    !isElectricity && product === "DATA" ? (network as string) : null,
  );

  const polling =
    step === "result" && payment?.status === "PENDING" && !pollTimedOut;
  const live = useBillPaymentStatus(payment?.reference ?? null, polling);

  useEffect(() => {
    if (!polling) return;
    const timer = setTimeout(() => setPollTimedOut(true), POLL_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [polling]);

  useEffect(() => {
    if (live.data) onPayment(live.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live.data]);

  const selectedPlan = plans.data?.find((p) => planKey(p) === planId);
  const phoneOk = phoneNumber.length >= 11 && phoneNumber.length <= 13;
  const detailsOk = isElectricity
    ? meterNumber.length >= 6 && Number(amount) >= MIN_ELECTRICITY
    : phoneOk &&
      (product === "AIRTIME" ? Number(amount) >= MIN_AIRTIME : !!selectedPlan);

  /** What the payment object itself can't say — captured for the receipt. */
  const receiptContext = (): BillReceiptContext =>
    isElectricity
      ? {
          networkName: providerName,
          meterNumber,
          meterType,
        }
      : {
          networkName: providerName,
          phoneNumber,
          planName: product === "DATA" ? selectedPlan?.plan : undefined,
        };

  const buildPayload = (): InitiateBillPayload =>
    disco
      ? {
          product: "ELECTRICITY",
          disco: disco.code,
          customerId: meterNumber,
          meterType,
          amount: Number(amount),
        }
      : product === "AIRTIME"
        ? {
            product: "AIRTIME",
            network: network as string,
            phoneNumber,
            amount: Number(amount),
          }
        : {
            product: "DATA",
            network: network as string,
            phoneNumber,
            productId: planKey(selectedPlan as DataPlan),
          };

  const handleContinue = () => {
    if (!detailsOk || initiate.isPending) return;
    setNotice("");
    initiate.mutate(buildPayload(), {
      onSuccess: (q) => {
        setQuote(q);
        setStep("review");
      },
    });
  };

  const handleReviewContinue = () => {
    if (initiate.isPending) return;
    setNotice("");
    confirm.reset();
    if (quote && new Date(quote.expiresAt).getTime() > Date.now()) {
      setStep("pin");
      return;
    }
    // The 10-minute payment token expired — price it again first.
    initiate.mutate(buildPayload(), {
      onSuccess: (q) => {
        setQuote(q);
        setStep("pin");
      },
    });
  };

  const handleConfirm = () => {
    if (!quote || pin.length < 4 || confirm.isPending) return;
    confirm.mutate(
      { paymentToken: quote.paymentToken, pin },
      {
        onSuccess: (p) => {
          setPayment(p);
          setStep("result");
          onPayment(p, receiptContext());
        },
        onError: (err) => {
          if (err.status === 409) {
            // Plan price changed server-side; nothing was charged.
            setNotice(err.message);
            setPlanId("");
            setStep("details");
            // Only data checkouts have a plans query to refresh.
            if (!isElectricity && product === "DATA") plans.refetch();
          } else if (
            err.status === 400 &&
            /payment (token|request)/i.test(err.message)
          ) {
            // Token invalid or expired — restart from initiate.
            setNotice("That payment session expired. Review and try again.");
            setStep("review");
            initiate.mutate(buildPayload(), {
              onSuccess: (q) => setQuote(q),
            });
          }
        },
      },
    );
  };

  // A timeout here does not mean the payment failed, and the same token is
  // safe to resend — it never charges twice.
  const confirmErrorMessage =
    confirm.error && step === "pin"
      ? confirm.error.status === 408 || confirm.error.status === 503
        ? "We couldn't tell if this payment went through. Tap Confirm to check again — you won't be charged twice."
        : confirm.error.message
      : undefined;
  const pinLocked = confirm.error?.status === 429;

  // Don't let a backdrop tap kill the modal mid-payment.
  const safeClose = () => {
    if (confirm.isPending) return;
    onClose();
  };

  const current = live.data ?? payment;

  const headerByStep: Record<Step, { title: string; subtitle?: string }> = {
    details: {
      title: providerName,
      subtitle: isElectricity
        ? "Buy electricity units"
        : "Buy airtime or a data bundle",
    },
    review: {
      title: "Review payment",
      subtitle: "Confirm the details before you pay",
    },
    pin: {
      title: "Enter PIN",
      subtitle: "Enter your 4-digit transaction PIN to confirm this payment.",
    },
    result: { title: "Payment" },
  };

  const summaryRow = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <span className="text-xs text-text shrink-0">{label}</span>
      <span className="text-sm font-medium text-card-text text-right min-w-0 wrap-break-word">
        {value}
      </span>
    </div>
  );

  const referenceRow = (reference: string) => (
    <div className="flex items-center justify-center gap-2 text-xs text-text">
      <span className="truncate">Ref: {reference}</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(reference);
          toast.success("Reference copied");
        }}
        className="p-1 rounded text-text hover:text-card-text transition-colors shrink-0"
        aria-label="Copy reference"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <Modal className="max-w-110 p-0" onClose={safeClose}>
      <ModalHeader
        className="px-6 pt-5 pb-0 max-sm:px-6"
        title={headerByStep[step].title}
        subtitle={headerByStep[step].subtitle}
        onBack={
          step === "review"
            ? () => {
                initiate.reset();
                setStep("details");
              }
            : step === "pin"
              ? () => setStep("review")
              : undefined
        }
        onClose={safeClose}
      />

      <div className="px-6 pb-6 pt-5">
        {step === "details" && (
          <div className="space-y-4">
            {isElectricity && (
              <>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-card-secondary border border-border">
                  {(["PREPAID", "POSTPAID"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setMeterType(t);
                        initiate.reset();
                      }}
                      className={cn(
                        "h-9 rounded-lg text-sm font-medium transition-colors",
                        meterType === t
                          ? "bg-card-background text-card-text shadow-sm"
                          : "text-text hover:text-card-text",
                      )}
                    >
                      {t === "PREPAID" ? "Prepaid" : "Postpaid"}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Meter Number
                  </label>
                  <input
                    value={meterNumber}
                    onChange={(e) =>
                      setMeterNumber(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="Enter your meter number"
                    inputMode="numeric"
                    maxLength={20}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Amount (₦)
                  </label>
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder={`Enter amount (min ₦${MIN_ELECTRICITY})`}
                    inputMode="numeric"
                    className={inputClasses}
                  />
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {ELECTRICITY_QUICK_AMOUNTS.map((qa) => (
                      <button
                        key={qa}
                        type="button"
                        onClick={() => setAmount(String(qa))}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                          amount === String(qa)
                            ? "border-Green bg-Green/10 text-Green font-medium"
                            : "border-border text-text hover:border-border-active",
                        )}
                      >
                        ₦{qa.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isElectricity && (
              <>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-card-secondary border border-border">
                  {(["AIRTIME", "DATA"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setProduct(p);
                        setNotice("");
                        initiate.reset();
                      }}
                      className={cn(
                        "h-9 rounded-lg text-sm font-medium transition-colors",
                        product === p
                          ? "bg-card-background text-card-text shadow-sm"
                          : "text-text hover:text-card-text",
                      )}
                    >
                      {p === "AIRTIME" ? "Airtime" : "Data"}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-1.5">
                    Phone Number
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder={meta?.inputPlaceholder ?? "0801 234 5678"}
                    inputMode="numeric"
                    maxLength={13}
                    className={inputClasses}
                  />
                </div>

                {product === "AIRTIME" ? (
                  <div>
                    <label className="block text-xs font-medium text-text mb-1.5">
                      Amount (₦)
                    </label>
                    <input
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value.replace(/[^\d]/g, ""))
                      }
                      placeholder={`Enter amount (min ₦${MIN_AIRTIME})`}
                      inputMode="numeric"
                      className={inputClasses}
                    />
                    {meta?.quickAmounts && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {meta.quickAmounts.map((qa) => (
                          <button
                            key={qa}
                            type="button"
                            onClick={() => setAmount(String(qa))}
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                              amount === String(qa)
                                ? "border-Green bg-Green/10 text-Green font-medium"
                                : "border-border text-text hover:border-border-active",
                            )}
                          >
                            ₦{qa.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-text mb-1.5">
                      Data Plan
                    </label>
                    {plans.error ? (
                      <div className="space-y-2.5">
                        <ErrorLayout message={plans.error.message} />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => plans.refetch()}
                        >
                          Try again
                        </Button>
                      </div>
                    ) : (
                      <DataPlanPicker
                        plans={plans.data ?? []}
                        loading={plans.isPending}
                        value={planId}
                        onChange={setPlanId}
                      />
                    )}
                  </div>
                )}
              </>
            )}

            <ErrorLayout message={notice || initiate.error?.message} />

            <Button
              className="w-full"
              disabled={!detailsOk || initiate.isPending}
              onClick={handleContinue}
            >
              {initiate.isPending ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" /> Checking...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        )}

        {step === "review" && quote && (
          <div className="space-y-4">
            <div className="px-4 rounded-xl bg-card-secondary border border-border">
              {summaryRow(
                isElectricity ? "Provider" : "Network",
                <span className="flex items-center gap-2 justify-end">
                  <BillerLogo
                    logo={meta?.logo}
                    name={providerName}
                    fallbackColor={meta?.fallbackColor}
                    size={22}
                    rounded="rounded-md"
                  />
                  {providerName}
                </span>,
              )}
              {isElectricity ? (
                <>
                  {summaryRow(
                    "Meter Type",
                    meterType === "PREPAID" ? "Prepaid" : "Postpaid",
                  )}
                  {summaryRow("Meter Number", meterNumber)}
                  {quote.customerName &&
                    summaryRow("Account Name", quote.customerName)}
                </>
              ) : (
                summaryRow("Phone Number", phoneNumber)
              )}
              {!isElectricity &&
                product === "DATA" &&
                selectedPlan &&
                summaryRow("Plan", selectedPlan.plan)}
              {summaryRow("Description", quote.description)}
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-card-secondary border border-border">
              <span className="text-xs text-text">You&apos;ll pay</span>
              <span className="text-sm font-semibold text-card-text">
                {formatNaira(quote.amount)}
              </span>
            </div>

            {isElectricity && (
              <p className="text-xs text-text px-1">
                Check that the account name matches your meter. Payments to the
                wrong meter usually can&apos;t be recovered.
              </p>
            )}

            <ErrorLayout message={notice || initiate.error?.message} />

            <Button
              className="w-full"
              disabled={initiate.isPending}
              onClick={handleReviewContinue}
            >
              {initiate.isPending ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" /> Refreshing...
                </span>
              ) : (
                "Continue to PIN"
              )}
            </Button>
          </div>
        )}

        {step === "pin" && quote && (
          <div className="space-y-5">
            <OtpInput length={4} onChange={setPin} />

            <ErrorLayout message={confirmErrorMessage} />

            <button
              onClick={() => setOpenResetPin(true)}
              className="text-xs font-normal leading-4.5 text-Green hover:underline transition-colors"
            >
              Forgot PIN?
            </button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                disabled={confirm.isPending}
                onClick={() => setStep("review")}
              >
                Back
              </Button>
              <Button
                className="flex-3"
                disabled={pin.length < 4 || confirm.isPending || pinLocked}
                variant={
                  confirm.isPending || pinLocked || pin.length < 4
                    ? "disabled"
                    : "default"
                }
                onClick={handleConfirm}
              >
                {confirm.isPending ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" />{" "}
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatNaira(quote.amount)}`
                )}
              </Button>
            </div>

            <ResetPinModal
              open={openResetPin}
              handleClose={() => setOpenResetPin(false)}
            />
          </div>
        )}

        {step === "result" && current && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center pt-2">
              {current.status === "COMPLETED" ? (
                <CheckCircle2 className="w-14 h-14 text-Green" />
              ) : current.status === "FAILED" ? (
                <XCircle className="w-14 h-14 text-error-text" />
              ) : (
                <LoaderCircle className="w-14 h-14 text-Green animate-spin" />
              )}
            </div>

            <div>
              <p className="text-lg font-semibold text-card-text">
                {current.status === "COMPLETED"
                  ? "Payment successful"
                  : current.status === "FAILED"
                    ? "Payment failed"
                    : "Processing payment"}
              </p>
              <p className="text-2xl font-bold text-card-text mt-1">
                {formatNaira(current.amount)}
              </p>
              <p className="text-sm text-text mt-2">{current.note}</p>
            </div>

            {current.status === "PENDING" && (
              <p className="text-xs text-text px-2">
                {pollTimedOut
                  ? "This is taking longer than usual. We'll notify you once it's confirmed — you can close this window."
                  : (current.message ??
                    "We're confirming this payment with our provider.")}
              </p>
            )}

            {current.status === "FAILED" && (
              <p className="text-xs text-text px-2">
                The money has been returned to your NGN wallet.
              </p>
            )}

            {current.token && (
              <div className="py-3 px-4 rounded-xl bg-card-secondary border border-border text-left">
                <p className="text-xs text-text">Token</p>
                <p className="text-sm font-semibold text-card-text break-all">
                  {current.token}
                </p>
                {current.units && (
                  <p className="text-xs text-text mt-1">
                    {current.units} units
                  </p>
                )}
              </div>
            )}

            {isElectricity &&
              meterType === "PREPAID" &&
              current.status === "COMPLETED" &&
              !current.token && (
                <p className="text-xs text-text px-2">
                  Your token isn&apos;t ready yet. It will show in your
                  transaction history shortly — contact support if it&apos;s
                  missing.
                </p>
              )}

            {referenceRow(current.reference)}

            {current.status === "PENDING" ? (
              <Button className="w-full" onClick={onClose}>
                Done
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 text-card-text"
                  onClick={() => setShowReceipt(true)}
                >
                  <ReceiptText className="w-4 h-4" />
                  Receipt
                </Button>
                <Button className="flex-1" onClick={onClose}>
                  Done
                </Button>
              </div>
            )}

            {showReceipt && (
              <TransactionReceiptModal
                {...buildBillReceipt(current, receiptContext())}
                onClose={() => setShowReceipt(false)}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
