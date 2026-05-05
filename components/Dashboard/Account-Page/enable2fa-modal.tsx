import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import {
  useEnable2FA,
  useTwoFactorAuthenticationGenerate,
} from "@/lib/services/security.service";
import Image from "next/image";
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
  const [success, setSuccess] = useState(false);

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
  return (
    <Modal className="p-0" onClose={onClose}>
      <div>
        <ModalHeader className="px-10 py-6" title="Enable 2fa" onClose={onClose} />
        {/* Loading */}
        {isGenerating && (
          <div className="w-full">
            {/* Content Skeleton */}
            <div className="px-8 pt-4 pb-8 space-y-8">
              <div className="space-y-4">
                {/* Large QR Code Skeleton */}
                <div className="flex justify-center">
                  <div className="h-40 w-40 bg-border rounded animate-pulse" />
                </div>

                {/* Secret Key Text Skeleton */}
                <div className="h-3 w-1/2 bg-border rounded mx-auto animate-pulse" />

                {/* Input Field Skeleton */}
                <div className="h-10 w-full bg-input-background border border-border rounded animate-pulse" />
              </div>

              {/* Buttons Skeleton */}
              <div className="flex gap-4">
                <div className="h-10 flex-1 bg-border rounded animate-pulse" />{" "}
                {/* Cancel Button */}
                <div className="h-10 flex-3 bg-border rounded animate-pulse" />{" "}
                {/* Verify Button */}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {/* {generateError && (
          <p className="text-error-text text-sm">Failed to generate QR code</p>
        )} */}

        {/* QR + Secret */}
        {!success ? (
          data?.data?.data && (
            <div>
              <div className="px-10 pt-4 pb-10 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <QRCode size={160} value={data.data.data.otpAuthUrl} />
                  </div>

                  <p className="text-xs text-text text-center break-all">
                    {data.data.data.secret}
                  </p>

                  {/* OTP input */}
                  <Input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter 6-digit code"
                  />
                </div>

                {/* Enable button */}
                <div className="flex gap-4">
                  <Button
                    onClick={() =>
                      enable2FA(token, {
                        onSuccess: () => {
                          onClose();
                        },
                      })
                    }
                    variant={"outline"}
                    type="button"
                    disabled={isEnabling || token.length !== 6}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      enable2FA(token, {
                        onSuccess: () => {
                          onClose();
                        },
                      })
                    }
                    type="submit"
                    disabled={isEnabling || token.length !== 6}
                    className="flex-3"
                  >
                    {isEnabling ? "Enabling..." : "Verify & Enable"}
                  </Button>
                </div>
                {/* Error */}
                {enableError && (
                  <p className="text-error-text text-sm text-center">
                    Invalid or expired code
                  </p>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="px-8 pt-4 pb-8 space-y-5 text-center">
            <ModalHeader className="px-8" onClose={onClose} />

            <Image
              alt="success"
              src={"/badge 2.svg"}
              width={60}
              height={60}
              className="mx-auto"
            />

            <h2 className="text-3xl font-bold text-card-text">
              Two factor authentication set successfully
            </h2>

            {/* <p className="text-sm text-text">
              Your account password has been updated successfully
            </p> */}

            <Button onClick={onClose} className="w-full">
              Confirm
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
