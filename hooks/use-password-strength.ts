import { useMemo } from "react";

export function usePasswordStrength(password: string) {
  const checks = useMemo(() => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
      letter: /[A-Za-z]/.test(password),
    };
  }, [password]);

  const score = Object.values(checks).filter(Boolean).length;

  let strengthLabel = "";
  if (password.length === 0) strengthLabel = "";
  else if (score <= 1) strengthLabel = "Too weak";
  else if (score === 2) strengthLabel = "Weak";
  else if (score === 3) strengthLabel = "Medium";
  else if (score === 4) strengthLabel = "Strong";
  else strengthLabel = "Very strong";

  const strengthPercent = (score / 5) * 100;

  return {
    checks,
    score,
    strengthLabel,
    strengthPercent,
  };
}