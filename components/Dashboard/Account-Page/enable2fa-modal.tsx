import { Modal } from "@/components/ui/Modal";
import { useEnable2FA, useTwoFactorAuthenticationGenerate } from "@/lib/services/security.service";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export const Enable2faModal = ({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) => {
    const [token, setToken] = useState("");

  const {
    mutate: generate2FA,
    data,
    isPending: isGenerating,
    error: generateError,
  } = useTwoFactorAuthenticationGenerate();

  const {
    mutate: enable2FA,
    isPending: isEnabling,
    error: enableError,
  } = useEnable2FA();

  useEffect(() => {
    if (open) {
      generate2FA();
    }
  }, []);
  if (!open) return null;
  return <Modal onClose={onClose}>
    <div className="space-y-4">
        <h3 className="text-card-text font-medium text-[16px]">
          Enable 2FA
        </h3>

        {/* Loading */}
        {isGenerating && (
          <p className="text-text text-sm">Generating QR code...</p>
        )}

        {/* Error */}
        {generateError && (
          <p className="text-error-text text-sm">
            Failed to generate QR code
          </p>
        )}

        {/* QR + Secret */}
        {data?.data?.data && (
          <>
            <div className="flex justify-center">
              <QRCode value={data.data.data.otpAuthUrl} />
            </div>

            <p className="text-xs text-text text-center break-all">
              {data.data.data.secret}
            </p>

            {/* OTP input */}
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              className="w-full border border-[var(--color-border)] rounded p-2 bg-[var(--color-input-background)] text-card-text"
            />

            {/* Enable button */}
            <button
              onClick={() => enable2FA(token, {
                onSuccess: () => {
                  onClose();
                },
              })}
              disabled={isEnabling || token.length !== 6}
              className="w-full bg-Green text-white py-2 rounded"
            >
              {isEnabling ? "Enabling..." : "Verify & Enable"}
            </button>

            {/* Error */}
            {enableError && (
              <p className="text-error-text text-sm text-center">
                Invalid or expired code
              </p>
            )}
          </>
        )}
      </div>
  </Modal>;
};
