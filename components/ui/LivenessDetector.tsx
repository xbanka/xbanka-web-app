"use client";

import React, {
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
import { useVerifySelfie } from "@/lib/services/onboarding.service";
import { useUserIdStore } from "@/store/verify-id.store";
import { base64ToFile } from "@/lib/base64ToFile";

let _faceLandmarker: FaceLandmarker | null = null;

async function loadFaceLandmarker() {
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
  setStep: (n: number) => void;
};

const LivenessDetector = forwardRef<
  { startCamera: () => Promise<void> },
  LivenessDetectorProps
>(function LivenessDetector({ brandColor = "#36b6ab", setStep }, ref) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const userId = useUserIdStore((s) => s.userId);
  const {
    mutate: verifySelfie,
    isPending,
    error: selfieError,
  } = useVerifySelfie();

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

  const startCamera = useCallback(async () => {
    try {
      setCameraStarted(true);
      setModelLoading(true);

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
        await loadFaceLandmarker();
        setModelLoading(false);
      };
    } catch (err) {
      setError("Camera permission denied");
    }
  }, []);

  useImperativeHandle(ref, () => ({
    startCamera,
  }));

  const handleCapture = async (base64Image: string) => {
    if (!userId) return;
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("selfieImage", base64ToFile(base64Image, "selfie.jpg"));

    verifySelfie(formData);
  };

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
            setCountdown(3);
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
  }, [countdown]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/jpeg");

    setCaptured(dataUrl);

    streamRef.current?.getTracks().forEach((t) => t.stop());

    handleCapture(dataUrl);
  };

  const handleRetry = () => {
    setCaptured(null);
    setCurrentAction("turnLeft");
    setCountdown(null);
    setError(null);
    startCamera();
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
    <div style={{ width: "100%", maxWidth: 500, margin: "auto" }}>
      {cameraStarted && !captured && (
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
      )}

      {!cameraStarted && !captured && (
        <div className="border-2 border-border-active rounded-2xl min-h-64 flex items-center justify-center overflow-hidden bg-transparent">
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
      )}
      {selfieError && <p className="bg-mainRed">{selfieError.message}</p>}

      {captured && (
        <div>
          <img src={captured} style={{ width: "100%" }} />

          <Button className="w-full" onClick={handleRetry}>
            Retake
          </Button>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 mt-1">
        <Button variant="outline" size="lg" className="flex-1">
          Skip
        </Button>
        {!cameraStarted && !captured && (
          <Button size="lg" className="flex-3" onClick={startCamera}>
            Open Camera
          </Button>
        )}

        {cameraStarted && !captured && (
          <Button size="lg" className="flex-3" disabled>
            Detecting face...
          </Button>
        )}

        {captured && (
          <Button size="lg" className="flex-3" onClick={() => setStep(4)}>
            {isPending ? "Verifying..." : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
});

export default LivenessDetector;
