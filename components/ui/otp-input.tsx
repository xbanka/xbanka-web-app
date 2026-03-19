"use client";
import { useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utis";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  className?: string;
}

export function OtpInput({
  length = 6,
  onComplete,
  onChange,
  disabled = false,
  error,
  label,
  hint,
  className,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [focused, setFocused] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputRefs.current[clamped]?.focus();
  };

  const updateValues = (next: string[]) => {
    setValues(next);
    const joined = next.join("");
    onChange?.(joined);
    if (joined.length === length && next.every((v) => v !== "")) {
      onComplete?.(joined);
    }
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, ""); // digits only
    if (!raw) return;

    // If user typed/pasted multiple digits into one box, fill forward
    if (raw.length > 1) {
      const next = [...values];
      let i = index;
      for (const char of raw) {
        if (i >= length) break;
        next[i++] = char;
      }
      updateValues(next);
      focusIndex(Math.min(index + raw.length, length - 1));
      return;
    }

    const next = [...values];
    next[index] = raw;
    updateValues(next);
    if (index < length - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (values[index]) {
        next[index] = "";
        updateValues(next);
      } else if (index > 0) {
        next[index - 1] = "";
        updateValues(next);
        focusIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusIndex(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusIndex(index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusIndex(length - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    updateValues(next);
    focusIndex(Math.min(pasted.length, length - 1));
  };

  const handleFocus = (index: number) => {
    setFocused(index);
    // Select text so next typed digit replaces it
    inputRefs.current[index]?.select();
  };

  const clear = () => {
    updateValues(Array(length).fill(""));
    focusIndex(0);
  };

  const isFilled = (i: number) => values[i] !== "";

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {label && (
        <p className="text-sm font-medium text-card-text self-start">{label}</p>
      )}

      {/* Digit boxes */}
      <div className="flex items-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={values[i]}
            disabled={disabled}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(i)}
            onBlur={() => setFocused(null)}
            aria-label={`Digit ${i + 1} of ${length}`}
            className={cn(
              // Base
              "w-11 h-13 sm:w-13 sm:h-15 rounded-xl border-2 bg-transparent text-center text-xl font-bold text-card-text",
              "outline-none transition-[border-color,box-shadow,background-color] duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "caret-transparent select-none",
              // States
              error
                ? "border-mainRed focus:border-mainRed focus:ring-[3px] focus:ring-mainRed/20"
                : isFilled(i)
                  ? "border-border-active bg-border-active/5"
                  : focused === i
                    ? "border-border-active ring-[3px] ring-border-active/20"
                    : "border-input hover:border-border-active/60",
            )}
          />
        ))}
      </div>

      {/* Hint / error */}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-mainRed self-start">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" />
            <text x="50%" y="50%" textAnchor="middle" dy=".35em" fill="white" fontSize="11" fontWeight="bold">!</text>
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-text self-start">{hint}</p>
      ) : null}

      {/* Clear link — only show when at least one digit entered */}
      {/* {values.some((v) => v !== "") && !disabled && (
        <button
          type="button"
          onClick={clear}
          className="text-xs text-text hover:text-card-text underline underline-offset-2 transition-colors self-start"
        >
          Clear
        </button>
      )} */}
    </div>
  );
}