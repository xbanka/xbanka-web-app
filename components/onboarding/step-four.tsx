"use client";

import { Camera, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { useVerifySelfie } from "@/lib/services/onboarding.service";
import { useUserStore } from "@/store/verify-id.store";

interface Step4Props {
  setStep: (n: number) => void;
  step: number;
}

function Step4({ setStep }: Step4Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [taken, setTaken] = useState(false);
  const userId = useUserStore((s) => s.userId);

  const { mutate: verifySelfie, isPending } = useVerifySelfie();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
        setTaken(false);
      }
    } catch {
      alert("Camera access denied or not available.");
    }
  };

  const stopStream = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
  };

  const takeSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.getContext("2d")?.drawImage(video, 0, 0, 640, 480);
    stopStream();
    setStreaming(false);
    setTaken(true);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas snapshot to a base64 data URL and send it
    const selfieUrl = canvas.toDataURL("image/jpeg", 0.85);

    verifySelfie({ userId, selfieUrl }, { onSuccess: () => setStep(5) });
  };

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text leading-tight">
          Almost Done!
          <br />
          Let's take a Selfie
        </h1>
        <p className="text-sm text-text leading-relaxed">
          We'll match your photo with your ID to confirm it's really you.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="border-2 border-border-active rounded-2xl min-h-64 flex items-center justify-center overflow-hidden bg-transparent">
          {!streaming && !taken && (
            <div className="flex flex-col items-center gap-3 text-placeholder">
              <Camera />
              <span className="text-sm">Camera preview will appear here</span>
            </div>
          )}
          {streaming && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-2xl block"
            />
          )}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className={taken ? "rounded-2xl block w-full" : "hidden"}
          />
        </div>
        <p className="text-xs text-text text-center">
          Good lighting. Neutral background. No hats or glasses.
        </p>
        {
          <div className="flex flex-col md:flex-row gap-4 mt-1">
            {!streaming && !taken && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button size="lg" className="flex-3" onClick={startCamera}>
                  Open Camera
                </Button>
              </>
            )}

            {streaming && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    stopStream();
                    setStreaming(false);
                  }}
                >
                  Cancel
                </Button>
                <Button size="lg" className="flex-3" onClick={takeSelfie}>
                  Capture
                </Button>
              </>
            )}

            {taken && (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={startCamera}
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake
                </Button>
                <Button
                  size="lg"
                  className="flex-3"
                  disabled={isPending}
                  variant={isPending ? "disabled" : "default"}
                  type="submit"
                  onClick={handleSubmit}
                >
                  {isPending ? "Verifying..." : "Continue"}
                </Button>
              </>
            )}
          </div>
        }
        {/* {!streaming && !taken && <Button onClick={startCamera}>Take Selfie</Button>}
        {streaming && <Button onClick={takeSelfie}>Capture</Button>}
        {taken && <Button onClick={() => { setTaken(false); startCamera(); }}>Retake Selfie</Button>} */}
      </div>
    </>
  );
}

export default Step4;
