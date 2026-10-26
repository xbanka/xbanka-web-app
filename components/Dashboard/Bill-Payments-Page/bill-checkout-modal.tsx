"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Copy,
  LoaderCircle,
  ReceiptText,
  Star,
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
  useCablePlans,
  useConfirmBill,
  useDataPlans,
  useInitiateBill,
} from "@/lib/services/bills.service";
import {
  BettingProvider,
  BillPayment,
  CableProvider,
  Disco,
  InitiateBillPayload,
  InitiateBillResponse,
  MeterType,
} from "@/lib/types/bills-types";
import { TransactionReceiptModal } from "@/components/ui/transaction-receipt-modal";
import { availableUnits } from "@/lib/transactionReceipt";
import { BillerLogo } from "./biller-logo";
import {
  BETTING_AMOUNTS,
  categoryBiller,
  ELECTRICITY_QUICK_AMOUNTS,
  formatNaira,
  networkBiller,
} from "./billers-data";
import { BillReceiptContext, buildBillReceipt } from "./bill-receipt";
import { DataPlanPicker, planKey } from "./data-plan-picker";
import {
  FavouriteBill,
  favouriteId,
  useFavouriteBills,
} from "./use-favourite-bills";

const MIN_AIRTIME = 50;
const MIN_ELECTRICITY = 1000;
const MIN_BETTING = 100;
/** Stop polling a PENDING payment after this long; an in-app notification is
 *  sent when the status changes. */
const POLL_WINDOW_MS = 60 * 1000;

type Step = "details" | "review" | "pin" | "result";

/** Data and cable plans both resolve to a key + "name — price" option. */
type PlanOption = { key: string; label: string; amount: number };

/** What this checkout is paying for. */
export type CheckoutTarget =
  | { kind: "network"; network: string }
  | { kind: "disco"; disco: Disco }
  | { kind: "cable"; provider: CableProvider }
  | { kind: "betting"; provider: BettingProvider };

/** Breaks a prepaid token into groups of four, the way meter keypads and the
 *  slips from the disco show it, so it can be read without losing your place.
 *  Tokens that aren't plain digits are left exactly as the provider sent them. */
const groupToken = (token: string) =>
  /^\d+$/.test(token) ? token.replace(/(\d{4})(?=\d)/g, "$1 ") : token;

const inputClasses =
  "w-full h-12 px-4 text-base md:text-sm border border-input rounded-xl bg-input-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow]";

export function BillCheckoutModal({
  target,
  prefill,
  onClose,
  onPayment,
}: {
  target: CheckoutTarget;
  /** Set when checkout was opened from a saved favourite, so the account
   *  fields start filled in. The amount or plan is always chosen afresh. */
  prefill?: FavouriteBill;
  onClose: () => void;
  /** Called with the payment object on confirm and on every status update.
   *  `context` only comes with the confirm call — status updates reuse the
   *  context stored at insert. */
  onPayment: (payment: BillPayment, context?: BillReceiptContext) => void;
}) {
  const { kind } = target;
  const isElectricity = kind === "disco";
  const isCable = kind === "cable";
  const isBetting = kind === "betting";
  const isNetwork = kind === "network";

  const meta =
    target.kind === "network"
      ? networkBiller(target.network)
      : target.kind === "disco"
        ? categoryBiller("electricity", target.disco.code, target.disco.name)
        : target.kind === "cable"
          ? categoryBiller("cable", target.provider.code, target.provider.name)
          : categoryBiller(
              "betting",
              target.provider.code,
              target.provider.name,
            );
  const providerName =
    target.kind === "network"
      ? (meta?.name ?? target.network)
      : target.kind === "disco"
        ? target.disco.name
        : target.provider.name;

  const [step, setStep] = useState<Step>("details");
  const [product, setProduct] = useState<"AIRTIME" | "DATA">(
    prefill?.product ?? "AIRTIME",
  );
  // A network favourite saves a phone number; betting saves an account id and
  // a phone number; the rest save the id the biller checks (meter, smartcard).
  const [phoneNumber, setPhoneNumber] = useState(
    prefill?.kind === "network"
      ? prefill.account
      : (prefill?.phoneNumber ?? ""),
  );
  const [amount, setAmount] = useState("");
  const [customerId, setCustomerId] = useState(
    prefill && prefill.kind !== "network" ? prefill.account : "",
  );
  const [planId, setPlanId] = useState("");
  const [pin, setPin] = useState("");
  const [quote, setQuote] = useState<InitiateBillResponse | null>(null);
  /** The serialised payload `quote` was fetched for — see `payloadKey`. */
  const [quotedKey, setQuotedKey] = useState<string | null>(null);
  /** The last payload a lookup was fired for, successful or not. */
  const [attemptedKey, setAttemptedKey] = useState<string | null>(null);
  const [payment, setPayment] = useState<BillPayment | null>(null);
  const [notice, setNotice] = useState("");
  const [openResetPin, setOpenResetPin] = useState(false);
  const [meterType, setMeterType] = useState<MeterType>(
    prefill?.meterType ?? "PREPAID",
  );
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const initiate = useInitiateBill();
  const confirm = useConfirmBill();
  const { isFavourite, toggle: toggleFavourite } = useFavouriteBills();
  const dataPlans = useDataPlans(
    target.kind === "network" && product === "DATA" ? target.network : null,
  );
  const cablePlans = useCablePlans(
    target.kind === "cable" ? target.provider.code : null,
  );
  const hasPlans = isCable || (isNetwork && product === "DATA");
  const plans = isCable ? cablePlans : dataPlans;

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

  const planOptions: PlanOption[] | undefined = isCable
    ? cablePlans.data?.map((p) => ({
        key: p.code,
        label: p.name,
        amount: p.amount,
      }))
    : dataPlans.data?.map((p) => ({
        key: planKey(p),
        label: p.plan,
        amount: p.amount,
      }));
  const selectedPlan = planOptions?.find((p) => p.key === planId);
  const phoneOk = phoneNumber.length >= 11 && phoneNumber.length <= 13;
  const detailsOk =
    target.kind === "disco"
      ? customerId.length >= 6 && Number(amount) >= MIN_ELECTRICITY
      : target.kind === "cable"
        ? customerId.length >= 6 && !!selectedPlan
        : target.kind === "betting"
          ? customerId.length >= 3 && phoneOk && Number(amount) >= MIN_BETTING
          : phoneOk &&
            (product === "AIRTIME"
              ? Number(amount) >= MIN_AIRTIME
              : !!selectedPlan);

  /** The code the API expects for this target, and the account just paid. */
  const targetCode =
    target.kind === "network"
      ? target.network
      : target.kind === "disco"
        ? target.disco.code
        : target.provider.code;
  const account = isNetwork ? phoneNumber : customerId;

  /** The saved-payment entry for what's on screen. Built from checkout state
   *  rather than the payment object, which doesn't carry the account. */
  const favouriteFor = (): FavouriteBill => ({
    id: favouriteId(kind, targetCode, account),
    kind,
    code: targetCode,
    providerName,
    billerId: meta?.id ?? targetCode.toLowerCase(),
    label: isNetwork
      ? product === "DATA"
        ? "Data bundle"
        : "Airtime"
      : isElectricity
        ? meterType === "PREPAID"
          ? "Prepaid meter"
          : "Postpaid meter"
        : isCable
          ? "TV subscription"
          : "Wallet top-up",
    account,
    phoneNumber: isBetting ? phoneNumber : undefined,
    product: isNetwork ? product : undefined,
    meterType: isElectricity ? meterType : undefined,
    savedAt: new Date().toISOString(),
  });

  const favouriteSaved = isFavourite(favouriteId(kind, targetCode, account));

  /** What the payment object itself can't say — captured for the receipt. */
  const receiptContext = (): BillReceiptContext => {
    switch (target.kind) {
      case "disco":
        return {
          networkName: providerName,
          meterNumber: customerId,
          meterType,
        };
      case "cable":
        return {
          networkName: providerName,
          customerId,
          planName: selectedPlan?.label,
        };
      case "betting":
        return { networkName: providerName, customerId, phoneNumber };
      case "network":
        return {
          networkName: providerName,
          phoneNumber,
          planName: product === "DATA" ? selectedPlan?.label : undefined,
        };
    }
  };

  const buildPayload = (): InitiateBillPayload => {
    switch (target.kind) {
      case "disco":
        return {
          product: "ELECTRICITY",
          disco: target.disco.code,
          customerId,
          meterType,
          amount: Number(amount),
        };
      case "cable":
        return {
          product: "CABLE_TV",
          cableTvType: target.provider.code,
          customerId,
          planCode: (selectedPlan as PlanOption).key,
        };
      case "betting":
        return {
          product: "BETTING",
          bettingProvider: target.provider.code,
          customerId,
          phoneNumber,
          amount: Number(amount),
        };
      case "network":
        return product === "AIRTIME"
          ? {
              product: "AIRTIME",
              network: target.network,
              phoneNumber,
              amount: Number(amount),
            }
          : {
              product: "DATA",
              network: target.network,
              phoneNumber,
              productId: (selectedPlan as PlanOption).key,
            };
    }
  };

  // Billers that check the account and hand back whose it is. Airtime and data
  // have nobody to look up, so they are never pre-verified.
  const verifies = isElectricity || isCable || isBetting;
  /** Identifies the inputs a quote belongs to; any edit invalidates it. */
  const payloadKey = detailsOk ? JSON.stringify(buildPayload()) : null;
  const quoteIsCurrent =
    !!quote &&
    payloadKey !== null &&
    payloadKey === quotedKey &&
    new Date(quote.expiresAt).getTime() > Date.now();

  // There is no "validate customer" route — initiate is what verifies, and it
  // needs the amount too, so this runs once the whole form is valid. The quote
  // it returns is the one the payment then uses, so this costs no extra call.
  //
  // Keyed on what was *attempted*, not what succeeded: a meter the biller
  // rejects must not be retried in a loop, and `isPending` is a dependency so
  // an edit made mid-flight still gets looked up once the first call lands.
  useEffect(() => {
    if (!verifies || step !== "details" || !payloadKey) return;
    if (payloadKey === attemptedKey || initiate.isPending) return;

    const timer = setTimeout(() => {
      setAttemptedKey(payloadKey);
      setNotice("");
      initiate.mutate(buildPayload(), {
        onSuccess: (q) => {
          setQuote(q);
          setQuotedKey(payloadKey);
        },
      });
    }, 600); // let typing settle before asking the biller
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadKey, attemptedKey, verifies, step, initiate.isPending]);

  const handleContinue = () => {
    if (!detailsOk || initiate.isPending) return;
    setNotice("");
    // The verification above already priced these exact details.
    if (quoteIsCurrent) {
      setStep("review");
      return;
    }
    initiate.mutate(buildPayload(), {
      onSuccess: (q) => {
        setQuote(q);
        setQuotedKey(payloadKey);
        setAttemptedKey(payloadKey);
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
            if (hasPlans) plans.refetch();
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
      subtitle: {
        network: "Buy airtime or a data bundle",
        disco: "Buy electricity units",
        cable: "Renew your subscription",
        betting: "Fund your betting account",
      }[kind],
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

  /** Cable bouquets, as tappable rows. Names are long and carry no size or
   *  validity to parse, so they list vertically rather than in the grid the
   *  data plans use. */
  const planSelect = hasPlans ? (
    plans.error ? (
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
    ) : plans.isPending ? (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-13 rounded-xl border border-border bg-card-secondary animate-pulse"
          />
        ))}
      </div>
    ) : !planOptions?.length ? (
      <div className="rounded-xl border border-border bg-card-secondary p-4 text-center text-sm text-text">
        No plans are available for this provider right now.
      </div>
    ) : (
      <div className="space-y-2 max-h-62 max-sm:max-h-84 overflow-y-auto pr-0.5 pb-2">
        {planOptions.map((p) => {
          const selected = p.key === planId;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setPlanId(p.key)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                selected
                  ? "border-Green bg-Green/10"
                  : "border-border bg-card-secondary hover:border-border-active",
              )}
            >
              <span className="min-w-0 truncate text-sm font-medium text-card-text">
                {p.label}
              </span>
              <span
                className={cn(
                  "shrink-0 text-sm font-semibold",
                  selected ? "text-Green" : "text-card-text",
                )}
              >
                {formatNaira(p.amount)}
              </span>
            </button>
          );
        })}
      </div>
    )
  ) : null;

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
    <Modal
      className="max-w-110 p-0 max-sm:flex max-sm:h-[90dvh] max-sm:max-h-[90dvh] max-sm:flex-col"
      onClose={safeClose}
    >
      {/* ModalHeader's own `max-sm:pb-8` is a separate key from `pb-0` to
          tailwind-merge, so mobile needs its paddings named explicitly. */}
      <ModalHeader
        className="px-6 pt-5 pb-0 max-sm:px-6 max-sm:pt-5 max-sm:pb-0"
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

      <div className="px-6 pb-6 pt-5 max-sm:flex-1 max-sm:pt-4">
        {step === "details" && (
          <div className="space-y-5">
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
                        "h-10 rounded-lg text-sm font-medium transition-colors",
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
                  <label className="block text-xs font-medium text-text mb-2">
                    Meter Number
                  </label>
                  <input
                    value={customerId}
                    onChange={(e) =>
                      setCustomerId(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="Enter your meter number"
                    inputMode="numeric"
                    maxLength={20}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-2">
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
                  {amount !== "" && Number(amount) < MIN_ELECTRICITY && (
                    <p className="mt-2 text-xs text-error-text">
                      Minimum amount is ₦{MIN_ELECTRICITY.toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ELECTRICITY_QUICK_AMOUNTS.map((qa) => (
                      <button
                        key={qa}
                        type="button"
                        onClick={() => setAmount(String(qa))}
                        className={cn(
                          "px-3.5 py-2 text-xs rounded-lg border transition-colors",
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

            {isCable && (
              <>
                <div>
                  <label className="block text-xs font-medium text-text mb-2">
                    {meta?.inputLabel ?? "Smartcard / IUC Number"}
                  </label>
                  <input
                    value={customerId}
                    onChange={(e) =>
                      setCustomerId(e.target.value.replace(/\s/g, ""))
                    }
                    placeholder={
                      meta?.inputPlaceholder ?? "Enter your smartcard number"
                    }
                    maxLength={40}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-2">
                    Plan
                  </label>
                  {planSelect}
                </div>
              </>
            )}

            {isBetting && (
              <>
                <div>
                  <label className="block text-xs font-medium text-text mb-2">
                    {meta?.inputLabel ?? "Account ID"}
                  </label>
                  <input
                    value={customerId}
                    onChange={(e) =>
                      setCustomerId(e.target.value.replace(/\s/g, ""))
                    }
                    placeholder={
                      meta?.inputPlaceholder ?? "Enter your betting account ID"
                    }
                    maxLength={40}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-2">
                    Phone Number
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="0801 234 5678"
                    inputMode="numeric"
                    maxLength={13}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text mb-2">
                    Amount (₦)
                  </label>
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder={`Enter amount (min ₦${MIN_BETTING})`}
                    inputMode="numeric"
                    className={inputClasses}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {BETTING_AMOUNTS.map((qa) => (
                      <button
                        key={qa}
                        type="button"
                        onClick={() => setAmount(String(qa))}
                        className={cn(
                          "px-3.5 py-2 text-xs rounded-lg border transition-colors",
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

            {isNetwork && (
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
                        "h-10 rounded-lg text-sm font-medium transition-colors",
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
                  <label className="block text-xs font-medium text-text mb-2">
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
                    <label className="block text-xs font-medium text-text mb-2">
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
                      <div className="flex flex-wrap gap-2 mt-3">
                        {meta.quickAmounts.map((qa) => (
                          <button
                            key={qa}
                            type="button"
                            onClick={() => setAmount(String(qa))}
                            className={cn(
                              "px-3.5 py-2 text-xs rounded-lg border transition-colors",
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
                    <label className="block text-xs font-medium text-text mb-2">
                      Data Plan
                    </label>
                    {dataPlans.error ? (
                      <div className="space-y-2.5">
                        <ErrorLayout message={dataPlans.error.message} />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => dataPlans.refetch()}
                        >
                          Try again
                        </Button>
                      </div>
                    ) : (
                      <DataPlanPicker
                        plans={dataPlans.data ?? []}
                        loading={dataPlans.isPending}
                        value={planId}
                        onChange={setPlanId}
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {/* Who the account belongs to, looked up as soon as the details
                are complete — so a wrong meter or smartcard is caught here
                rather than after paying. */}
            {verifies && initiate.isPending && (
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card-secondary px-4 py-3">
                <LoaderCircle className="w-4 h-4 text-Green animate-spin shrink-0" />
                <span className="text-sm text-text">
                  Checking {isElectricity ? "meter" : "account"}…
                </span>
              </div>
            )}

            {verifies && !initiate.isPending && quoteIsCurrent && (
              <div className="rounded-xl border border-Green/40 bg-Green/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-Green shrink-0" />
                  <span className="text-xs font-medium text-Green">
                    {isElectricity
                      ? "Meter verified"
                      : isCable
                        ? "Account verified"
                        : "Account found"}
                  </span>
                </div>
                <p className="mt-1.5 text-base font-semibold text-card-text wrap-break-word">
                  {quote?.customerName ?? providerName}
                </p>
                {quote?.customerAddress && (
                  <p className="mt-0.5 text-sm text-text wrap-break-word">
                    {quote.customerAddress}
                  </p>
                )}
                <p className="mt-1 text-xs text-text">
                  {isElectricity
                    ? `${meterType === "PREPAID" ? "Prepaid" : "Postpaid"} • ${customerId}`
                    : customerId}
                </p>
              </div>
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
          <div className="space-y-5">
            <div className="px-4 rounded-xl bg-card-secondary border border-border">
              {summaryRow(
                isNetwork ? "Network" : "Provider",
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
              {isElectricity &&
                summaryRow(
                  "Meter Type",
                  meterType === "PREPAID" ? "Prepaid" : "Postpaid",
                )}
              {isElectricity && summaryRow("Meter Number", customerId)}
              {isCable &&
                summaryRow(meta?.inputLabel ?? "Smartcard / IUC", customerId)}
              {isBetting &&
                summaryRow(meta?.inputLabel ?? "Account ID", customerId)}
              {!isElectricity &&
                !isCable &&
                phoneNumber &&
                summaryRow("Phone Number", phoneNumber)}
              {quote.customerName &&
                summaryRow("Account Name", quote.customerName)}
              {(isCable || (isNetwork && product === "DATA")) &&
                selectedPlan &&
                summaryRow("Plan", selectedPlan.label)}
              {summaryRow("Description", quote.description)}
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-card-secondary border border-border">
              <span className="text-xs text-text">You&apos;ll pay</span>
              <span className="text-sm font-semibold text-card-text">
                {formatNaira(quote.amount)}
              </span>
            </div>

            {!isNetwork && (
              <p className="text-xs text-text px-1">
                Check that the account name matches{" "}
                {isElectricity
                  ? "your meter"
                  : isCable
                    ? "your smartcard"
                    : "your betting account"}
                . Payments to the wrong{" "}
                {isElectricity ? "meter" : isCable ? "card" : "account"} usually
                can&apos;t be recovered.
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
            <OtpInput length={4} mask onChange={setPin} />

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
          <div className="space-y-5 text-center">
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

            {/* The token gets typed into a meter keypad digit by digit, often
                by someone reading it off the phone at arm's length — so it is
                set large, grouped in fours and copyable. */}
            {current.token && (
              <div className="py-4 px-4 rounded-xl bg-card-secondary border border-border text-left">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-text">Token</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(current.token as string);
                      toast.success("Token copied");
                    }}
                    className="flex items-center gap-1 text-xs text-Green hover:underline shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
                <p className="mt-1.5 text-2xl font-bold tracking-wide text-card-text break-all tabular-nums max-sm:text-[22px]">
                  {groupToken(current.token)}
                </p>
                {availableUnits(current.units) && (
                  <p className="text-sm text-text mt-1.5">
                    {availableUnits(current.units)} units
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

            {/* Offered once the payment has actually gone through — there's no
                point saving a shortcut to something that just failed. */}
            {current.status === "COMPLETED" && account && (
              <button
                onClick={() => {
                  const saved = toggleFavourite(favouriteFor());
                  toast.success(
                    saved
                      ? "Saved to favourites"
                      : "Removed from favourites",
                  );
                }}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-colors",
                  favouriteSaved
                    ? "border-Green text-Green"
                    : "border-border text-text hover:border-border-active hover:text-card-text",
                )}
              >
                <Star
                  className={cn("w-4 h-4", favouriteSaved && "fill-Green")}
                />
                {favouriteSaved ? "Saved to favourites" : "Save to favourites"}
              </button>
            )}

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
