"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  FilesetResolver,
  FaceLandmarker,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { Button } from "./button";
import {
  useSkipStep,
  useVerifySelfie,
} from "@/lib/services/onboarding.service";
import { base64ToFile } from "@/lib/base64ToFile";
import { UseProfileUser } from "@/lib/services/profile.service";
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

type LivenessDetectorProps = {
  brandColor?: string;
  onBack: () => void;
  onSuccess: () => void;
};

const LivenessDetector = forwardRef<
  { startCamera: () => Promise<void> },
  LivenessDetectorProps
>(function LivenessDetector(
  { brandColor = "#36b6ab", onBack, onSuccess },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasCapturedRef = useRef(false);
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;
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
  type LivenessAction = "turnLeft" | "turnRight" | "neutral";

  const [currentAction, setCurrentAction] =
    useState<LivenessAction>("turnLeft");

  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prevLandmarks = useRef<NormalizedLandmark[] | null>(null);

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        setError(null);
        onSuccess();
      },
    });
  };

  const startCamera = useCallback(async () => {
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
        // await loadFaceLandmarker();
        // setModelLoading(false);
      };
    } catch {
      setError("Camera permission denied");
    }
  }, []);

  useImperativeHandle(ref, () => ({
    startCamera,
  }));

  const handleCapture = useCallback(async (base64Image: string) => {
    console.log("handleCapture called");

    if (!userId) return;
    const formData = new FormData();

    formData.append("userId", userId);
    // const file = base64ToFile(base64Image, "selfie.jpg");

    // console.log("File size MB:", (file.size / 1024 / 1024).toFixed(2));
    formData.append("selfieImage", base64ToFile(base64Image, "selfie.jpg"));

    console.log("sending request");
    verifySelfie(formData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  }, [onSuccess, userId, verifySelfie]);

  const captureImage = useCallback(async () => {
    if (hasCapturedRef.current) return;

    hasCapturedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // create compressed canvas
    const compressedCanvas = document.createElement("canvas");

    // reduce resolution
    compressedCanvas.width = 480;
    compressedCanvas.height = 360;

    const ctx = compressedCanvas.getContext("2d");

    if (!ctx) return;

    // draw smaller image
    ctx.drawImage(canvas, 0, 0, 480, 360);

    // compress jpeg quality (0 - 1)
    const dataUrl = compressedCanvas.toDataURL("image/jpeg", 0.6);

    setCaptured(dataUrl);

    streamRef.current?.getTracks().forEach((t) => t.stop());

    handleCapture(dataUrl);
  }, [handleCapture]);

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
            setError("Please move your face slightly");
            return setTimeout(loop, 200);
          }
        }

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
  // useEffect(() => {
  //   let mounted = true;

  //   const init = async () => {
  //     try {
  //       // preload mediapipe model
  //       await loadFaceLandmarker();

  //       if (!mounted) return;

  //       setModelLoading(false);

  //       // auto open camera immediately
  //       await startCamera();
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to initialize camera");
  //     }
  //   };

  //   init();

  //   return () => {
  //     mounted = false;

  //     streamRef.current?.getTracks().forEach((t) => t.stop());
  //   };
  // }, [startCamera]);

  // normal selfie image size
  // const captureImage = () => {
  //   if (hasCapturedRef.current) return;

  //   hasCapturedRef.current = true;
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const dataUrl = canvas.toDataURL("image/jpeg");

  //   setCaptured(dataUrl);

  //   streamRef.current?.getTracks().forEach((t) => t.stop());

  //   handleCapture(dataUrl);
  // };

  const handleRetry = () => {
    setCaptured(null);
    setCurrentAction("turnLeft");
    setCountdown(null);
    setError(null);
    startCamera();
    setCameraStarted(false);
    setIsReady(false);
  };

  const instruction = () => {
    if (!cameraStarted) return "Click start to begin";
    if (!isReady) return "Preparing camera...";
    if (modelLoading) return "Loading model...";
    if (currentAction === "turnLeft") return "Turn head LEFT";
    if (currentAction === "turnRight") return "Turn head RIGHT";
    if (countdown !== null) return `Capturing in ${countdown}`;
    return "Look straight";
  };

  return (
    <div className="mx-auto flex w-full max-w-[500px] flex-col space-y-6 max-sm:min-h-0 max-sm:flex-1 max-sm:space-y-0">
      {cameraStarted && !captured && (
        <div className="space-y-4 max-sm:space-y-5">
          <div style={{ position: "relative" }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", transform: "scaleX(-1)" }}
            />

            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{ display: "none" }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              {instruction()}
            </div>

            {error && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  right: 10,
                  background: "red",
                  color: "#fff",
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                {error}
              </div>
            )}
          </div>
          <p className="text-xs font-normal leading-4.5 text-text text-center">
            Good lighting. Neutral background. No hats or glasses.
          </p>
        </div>
      )}

      {!cameraStarted && !captured && (
        <div className="space-y-4 max-sm:space-y-5">
          <div
            className="border-2 border-border-active rounded-2xl min-h-64 flex items-center justify-center overflow-hidden bg-transparent max-sm:h-[295px] max-sm:min-h-0"
            style={{ borderColor: brandColor }}
          >
            {/* {!streaming && !taken && (
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
          /> */}
          </div>
          <p className="text-xs font-normal leading-4.5 text-text text-center">
            Good lighting. Neutral background. No hats or glasses.
          </p>
        </div>
      )}
      {(selfieError || skipError) && (
        <div className="space-y-4">
          <ErrorLayout message={selfieError?.message || skipError?.message} />
        </div>
      )}

      {captured && (
        <div>
          <img alt="Captured selfie" src={captured} style={{ width: "100%" }} />

          <Button className="w-full" onClick={handleRetry}>
            Retake
          </Button>
        </div>
      )}
      <div className="space-y-3.25 max-sm:mt-auto max-sm:-mx-5 max-sm:border-t max-sm:border-border max-sm:px-5 max-sm:pt-4 max-sm:pb-4">
        <div className="flex flex-col gap-4 mt-1 md:flex-row max-sm:mt-0 max-sm:grid max-sm:grid-cols-[126px_1fr] max-sm:gap-3.5">
          <Button
            type="button"
            onClick={() => onBack()}
            variant="outline"
            size="lg"
            className="flex-1 max-sm:h-[50px] max-sm:text-[16px]"
          >
            Back
          </Button>
          {!cameraStarted && !captured && (
            <Button
              type="button"
              size="lg"
              className="flex-3 max-sm:h-[50px] max-sm:text-[16px]"
              onClick={startCamera}
            >
              <span className="hidden sm:inline">Open Camera</span>
              <span className="sm:hidden">Continue</span>
            </Button>
          )}

          {cameraStarted && !captured && (
            <Button
              size="lg"
              className="flex-3 max-sm:h-[50px] max-sm:text-[16px]"
              disabled
            >
              Detecting face...
            </Button>
          )}

          {captured && (
            <Button
              size="lg"
              className="flex-3 max-sm:h-[50px] max-sm:text-[16px]"
              disabled={isPending}
            >
              {isPending ? "Verifying..." : "Next"}
            </Button>
          )}
        </div>
        <h1
          onClick={handleSkip}
          className="font-medium text-[14px] leading-5.5 text-Green cursor-pointer max-sm:text-center max-sm:text-[18px] max-sm:leading-7"
        >
          {skipPending ? "Skipping..." : "Skip for later"}
        </h1>
      </div>
    </div>
  );
});

export default LivenessDetector;
