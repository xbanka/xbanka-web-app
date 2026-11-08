"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from "react";

import {
  FilesetResolver,
  FaceLandmarker,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import {
  ArrowLeft,
  ArrowRight,
  CameraOff,
  Check,
  Glasses,
  Loader2,
  Lock,
  RotateCcw,
  ScanFace,
  Sun,
} from "lucide-react";
import { Button } from "./button";
import {
  useSkipStep,
  useVerifySelfie,
} from "@/lib/services/onboarding.service";
import { base64ToFile } from "@/lib/base64ToFile";
import { cn } from "@/lib/utils";
import { ErrorLayout } from "./error-layout";

let _faceLandmarker: FaceLandmarker | null = null;

export async function loadFaceLandmarker() {
  if (_faceLandmarker) return _faceLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
  );

  _faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    runningMode: "VIDEO",
    numFaces: 1,
  });

  return _faceLandmarker;
}

async function detectFace(videoEl: HTMLVideoElement) {
  const landmarker = await loadFaceLandmarker();

  if (!landmarker) return null;

  try {
    return landmarker.detectForVideo(videoEl, performance.now());
  } catch {
    return null;
  }
}

const LEFT_EYE_IDX = 33;
const RIGHT_EYE_IDX = 362;

function calcFaceDirection(landmarks: NormalizedLandmark[]) {
  const l = landmarks[LEFT_EYE_IDX];
  const r = landmarks[RIGHT_EYE_IDX];
  return (l.x - r.x) / (l.z - r.z);
}

const TURN_LEFT_MIN = 5;
const TURN_LEFT_MAX = 20;
const TURN_RIGHT_MIN = -5;
const TURN_RIGHT_MAX = 0;

// Longest side of the photo sent for matching. The frame keeps the camera's
// own aspect ratio (portrait on phones) so the face is never stretched.
const CAPTURE_MAX_SIDE = 640;

type LivenessAction = "turnLeft" | "turnRight" | "neutral";

/** The three prompts, in order; each fills one third of the ring. */
const STEPS: { action: LivenessAction; label: string }[] = [
  { action: "turnLeft", label: "Turn left" },
  { action: "turnRight", label: "Turn right" },
  { action: "neutral", label: "Hold still" },
];

const TIPS = [
  { icon: Sun, label: "Good lighting" },
  { icon: Glasses, label: "No glasses or hats" },
  { icon: ScanFace, label: "Face in the circle" },
];

type LivenessDetectorProps = {
  /** @deprecated The frame uses the theme's colours now; kept for callers. */
  brandColor?: string;
  userId: string;
  sessionId?: string;
  hideBack?: boolean;
  hideSkip?: boolean;
  onBack?: () => void;
  onSuccess: () => void;
};

const LivenessDetector = forwardRef<
  { startCamera: () => Promise<void> },
  LivenessDetectorProps
>(function LivenessDetector(
  { userId, sessionId, hideBack = false, hideSkip = false, onBack, onSuccess },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasCapturedRef = useRef(false);
  const {
    mutate: verifySelfie,
    isPending,
    error: selfieError,
  } = useVerifySelfie();
  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();

  const [cameraStarted, setCameraStarted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);

  const [currentAction, setCurrentAction] =
    useState<LivenessAction>("turnLeft");

  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  // A nudge while scanning (e.g. the face looks frozen); clears on its own.
  const [hint, setHint] = useState<string | null>(null);

  const prevLandmarks = useRef<NormalizedLandmark[] | null>(null);

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      setCameraStarted(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;

      video.onloadedmetadata = async () => {
        await video.play();
        setIsReady(true);
      };
    } catch {
      setCameraStarted(false);
      setCameraError(
        "We couldn't open your camera. Allow camera access in your browser settings, then try again.",
      );
    }
  }, []);

  useImperativeHandle(ref, () => ({
    startCamera,
  }));

  // Only the user's submit click sends the selfie. Taking the photo just shows
  // the preview, so the user can retake it before anything is submitted.
  const submitSelfie = useCallback(() => {
    if (!userId || !captured || isPending) return;
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("selfieImage", base64ToFile(captured, "selfie.jpg"));

    if (sessionId) {
      formData.append("sessionId", sessionId);
    }

    verifySelfie(formData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  }, [captured, isPending, onSuccess, sessionId, userId, verifySelfie]);

  const captureImage = useCallback(() => {
    if (hasCapturedRef.current) return;

    hasCapturedRef.current = true;

    // Take the frame now, at the end of "Hold still", rather than the last
    // one the detection loop drew while the head was still turning.
    const video = videoRef.current;
    const source = video?.videoWidth ? video : canvasRef.current;
    if (!source) return;

    const width = video?.videoWidth || 640;
    const height = video?.videoHeight || 480;
    const scale = Math.min(1, CAPTURE_MAX_SIDE / Math.max(width, height));

    const compressedCanvas = document.createElement("canvas");
    compressedCanvas.width = Math.round(width * scale);
    compressedCanvas.height = Math.round(height * scale);

    const ctx = compressedCanvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(source, 0, 0, compressedCanvas.width, compressedCanvas.height);

    // compress jpeg quality (0 - 1)
    const dataUrl = compressedCanvas.toDataURL("image/jpeg", 0.6);

    setCaptured(dataUrl);

    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (!isReady || modelLoading) return;

    let active = true;

    const loop = async () => {
      if (!active) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        return setTimeout(loop, 100);
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const result = await detectFace(video);

      const landmarks = result?.faceLandmarks?.[0];

      if (landmarks) {
        const dir = calcFaceDirection(landmarks);

        /** anti spoof detection */
        if (prevLandmarks.current) {
          const movement =
            Math.abs(prevLandmarks.current[0].x - landmarks[0].x) +
            Math.abs(prevLandmarks.current[0].y - landmarks[0].y);

          if (movement < 0.0001) {
            setHint("Move your face slightly");
            return setTimeout(loop, 200);
          }
        }
        setHint(null);

        prevLandmarks.current = landmarks;

        if (currentAction === "turnLeft") {
          if (dir >= TURN_LEFT_MIN && dir <= TURN_LEFT_MAX) {
            setCurrentAction("turnRight");
          }
        } else if (currentAction === "turnRight") {
          if (dir >= TURN_RIGHT_MIN && dir <= TURN_RIGHT_MAX) {
            setCurrentAction("neutral");

            // stop detection loop
            active = false;
            setCountdown(3);

            return;
          }
        }
      }

      setTimeout(loop, 120);
    };

    loop();

    return () => {
      active = false;
    };
  }, [isReady, modelLoading, currentAction]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const t = setTimeout(() => {
        setCountdown((c) => (c ? c - 1 : 0));
      }, 1000);
      return () => clearTimeout(t);
    } else {
      captureImage();
    }
  }, [captureImage, countdown]);

  useEffect(() => {
    loadFaceLandmarker().then(() => {
      setModelLoading(false);
    });
  }, []);

  const handleRetry = () => {
    hasCapturedRef.current = false;
    prevLandmarks.current = null;
    setCaptured(null);
    setCurrentAction("turnLeft");
    setCountdown(null);
    setHint(null);
    setIsReady(false);
    startCamera();
  };

  const scanning = cameraStarted && !captured;
  const preparing = scanning && (!isReady || modelLoading);
  const stepIndex = captured
    ? STEPS.length
    : STEPS.findIndex((step) => step.action === currentAction);

  const heading = (() => {
    if (captured) return "Check your photo";
    if (cameraError) return "Camera unavailable";
    if (!cameraStarted) return "Ready when you are";
    if (preparing) return "Getting your camera ready";
    if (currentAction === "turnLeft") return "Turn your head left";
    if (currentAction === "turnRight") return "Now turn right";
    return "Hold still";
  })();

  const subheading = (() => {
    if (captured) return "Make sure your whole face is clear, sharp and well lit.";
    if (cameraError) return null;
    if (!cameraStarted)
      return "Keep your face in the circle and follow three quick prompts.";
    if (preparing) return "This only takes a moment.";
    if (countdown !== null) return `Taking your photo in ${countdown}`;
    return "Slowly, then come back to the centre.";
  })();

  return (
    <div className="mx-auto flex w-full max-w-[500px] flex-col gap-6 max-sm:min-h-0 max-sm:flex-1 max-sm:gap-5">
      <div className="flex flex-col items-center gap-5">
        <FaceStage
          stepIndex={stepIndex}
          active={scanning && !preparing}
          error={!!cameraError}
        >
          {/* The video stays mounted while scanning so the stream can attach
              before the first frame. */}
          {scanning && (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="size-full object-cover -scale-x-100"
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="hidden"
              />
              {preparing && (
                <div className="absolute inset-0 flex items-center justify-center bg-card-secondary">
                  <Loader2 className="size-8 animate-spin text-Green" />
                </div>
              )}
              {!preparing && currentAction !== "neutral" && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-Green text-white animate-pulse",
                    currentAction === "turnLeft" ? "left-3" : "right-3",
                  )}
                >
                  {currentAction === "turnLeft" ? (
                    <ArrowLeft className="size-5" />
                  ) : (
                    <ArrowRight className="size-5" />
                  )}
                </span>
              )}
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <span
                    key={countdown}
                    className="text-6xl font-bold text-white animate-fade-up"
                  >
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}

          {captured && (
            <img
              alt="Captured selfie"
              src={captured}
              className="size-full object-cover"
            />
          )}

          {!scanning && !captured && (
            <div className="flex size-full items-center justify-center bg-card-secondary">
              {cameraError ? (
                <CameraOff className="size-12 text-placeholder" />
              ) : (
                <FaceGuide />
              )}
            </div>
          )}
        </FaceStage>

        <div className="space-y-1.5 text-center" aria-live="polite">
          <p className="text-lg font-semibold leading-7 text-card-text">
            {heading}
          </p>
          {subheading && (
            <p className="text-sm leading-5 text-text">{subheading}</p>
          )}
          {hint && scanning && (
            <p className="mx-auto mt-2 w-fit rounded-full border border-yellow-warning-border bg-yellow-warning-light px-3 py-1 text-xs font-medium text-yellow-warning-text">
              {hint}
            </p>
          )}
        </div>

        {(cameraStarted || captured) && !cameraError ? (
          <ol className="flex items-center gap-2" aria-label="Selfie steps">
            {STEPS.map((step, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex && scanning && !preparing;
              return (
                <li
                  key={step.action}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    done && "border-teal-border bg-teal-light text-teal-text",
                    current && "border-Green text-card-text",
                    !done && !current && "border-border text-placeholder",
                  )}
                >
                  {done && <Check className="size-3.5" />}
                  {step.label}
                </li>
              );
            })}
          </ol>
        ) : (
          !cameraError && (
            <ul className="grid w-full grid-cols-3 gap-2">
              {TIPS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card-secondary px-2 py-3 text-center"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-teal-light text-teal-text">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-xs leading-4 text-card-text">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          )
        )}

        <ErrorLayout
          message={
            cameraError ?? selfieError?.message ?? skipError?.message
          }
        />

        <p className="flex items-center justify-center gap-1.5 text-xs leading-4.5 text-placeholder">
          <Lock className="size-3.5 shrink-0" />
          Your selfie is encrypted and only used to verify it&apos;s you.
        </p>
      </div>

      <div className="space-y-3.25 max-sm:mt-auto max-sm:-mx-5 max-sm:border-t max-sm:border-border max-sm:px-5 max-sm:pt-4 max-sm:pb-4">
        <div
          className={cn(
            "flex flex-col gap-4 mt-1 md:flex-row max-sm:mt-0 max-sm:gap-3.5",
            (captured || !hideBack) && "max-sm:grid max-sm:grid-cols-[126px_1fr]",
          )}
        >
          {captured ? (
            <Button
              type="button"
              onClick={handleRetry}
              variant="outline"
              size="lg"
              className="flex-1 max-sm:h-[50px] max-sm:text-[16px]"
              disabled={isPending}
            >
              <RotateCcw />
              Retake
            </Button>
          ) : (
            !hideBack && (
              <Button
                type="button"
                onClick={() => onBack?.()}
                variant="outline"
                size="lg"
                className="flex-1 max-sm:h-[50px] max-sm:text-[16px]"
              >
                Back
              </Button>
            )
          )}

          {!cameraStarted && !captured && (
            <Button
              type="button"
              size="lg"
              className="flex-3 max-sm:h-[50px] max-sm:text-[16px]"
              onClick={startCamera}
            >
              {cameraError ? "Try again" : "Open Camera"}
            </Button>
          )}

          {scanning && (
            <Button
              size="lg"
              variant="disabled"
              className="flex-3 max-sm:h-[50px] max-sm:text-[16px]"
              disabled
            >
              {countdown !== null ? "Taking photo..." : "Scanning your face..."}
            </Button>
          )}

          {captured && (
            <Button
              type="button"
              size="lg"
              className="flex-3 max-sm:h-[50px] max-sm:text-[16px]"
              disabled={isPending}
              onClick={submitSelfie}
            >
              {isPending ? "Verifying..." : "Submit selfie"}
            </Button>
          )}
        </div>
        {!hideSkip && (
          <button
            type="button"
            onClick={handleSkip}
            disabled={skipPending}
            className="w-full font-medium text-[14px] leading-5.5 text-Green cursor-pointer text-left max-sm:text-center max-sm:text-[18px] max-sm:leading-7"
          >
            {skipPending ? "Skipping..." : "Skip for later"}
          </button>
        )}
      </div>
    </div>
  );
});

/**
 * The round camera frame. A ring of three arcs sits around it, one per step:
 * done steps are solid green, the current one pulses, the rest stay muted.
 */
function FaceStage({
  stepIndex,
  active,
  error,
  children,
}: {
  stepIndex: number;
  active: boolean;
  error: boolean;
  children: ReactNode;
}) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const gap = 5;
  const third = circumference / STEPS.length;
  const arc = third - gap;

  return (
    <div className="relative aspect-square w-[min(68vw,248px)]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden="true"
      >
        {STEPS.map((step, i) => (
          <circle
            key={step.action}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference - arc}`}
            strokeDashoffset={-(i * third + gap / 2)}
            className={cn(
              "transition-colors duration-500",
              error
                ? "stroke-error-text"
                : i < stepIndex
                  ? "stroke-Green"
                  : i === stepIndex && active
                    ? "stroke-abstract-green animate-pulse"
                    : "stroke-border",
            )}
          />
        ))}
      </svg>
      <div className="absolute inset-[7%] overflow-hidden rounded-full border border-border bg-card-secondary">
        {children}
      </div>
      {stepIndex >= STEPS.length && (
        <span className="absolute bottom-[6%] right-[6%] flex size-10 items-center justify-center rounded-full border-4 border-card-background bg-Green text-white animate-fade-up">
          <Check className="size-5" strokeWidth={3} />
        </span>
      )}
    </div>
  );
}

/** Placeholder before the camera opens: where the face should sit. */
function FaceGuide() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="size-[62%]"
      fill="none"
      aria-hidden="true"
    >
      {/* scan corners */}
      <g
        className="stroke-Green"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 34V22a8 8 0 0 1 8-8h12" />
        <path d="M86 14h12a8 8 0 0 1 8 8v12" />
        <path d="M106 86v12a8 8 0 0 1-8 8H86" />
        <path d="M34 106H22a8 8 0 0 1-8-8V86" />
      </g>
      {/* head */}
      <circle
        cx="60"
        cy="50"
        r="18"
        strokeWidth="2.5"
        className="stroke-placeholder"
      />
      {/* shoulders */}
      <path
        d="M32 98c0-15 12.5-25 28-25s28 10 28 25"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="stroke-placeholder"
      />
    </svg>
  );
}

export default LivenessDetector;
