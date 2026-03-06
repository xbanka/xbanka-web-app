"use client"

import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

function Step4({ onSkip }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [streaming, setStreaming] = useState(false);
  const [taken, setTaken] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch {
      alert("Camera access denied or not available.");
    }
  };

  const takeSelfie = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    videoRef.current.srcObject?.getTracks().forEach((t) => t.stop());
    setTaken(true);
    setStreaming(false);
  };

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text leading-tight">Almost Done!<br />Let's take a Selfie</h1>
        <p className="text-sm text-text leading-relaxed">We'll match your photo with your ID to confirm it's really you.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="border-2 border-border-active rounded-2xl min-h-64 flex items-center justify-center overflow-hidden bg-transparent">
          {!streaming && !taken && (
            <div className="flex flex-col items-center gap-3 text-placeholder">
              <Camera />
              <span className="text-sm">Camera preview will appear here</span>
            </div>
          )}
          {streaming && <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl block" />}
          <canvas ref={canvasRef} width={640} height={480} className={taken ? "rounded-2xl block w-full" : "hidden"} />
        </div>
        <p className="text-xs text-text text-center">Good lighting. Neutral background. No hats or glasses.</p>
        {!streaming && !taken && <Button onClick={startCamera}>Take Selfie</Button>}
        {streaming && <Button onClick={takeSelfie}>Capture</Button>}
        {taken && <Button onClick={() => { setTaken(false); startCamera(); }}>Retake Selfie</Button>}
        <Button onClick={onSkip} />
      </div>
    </>
  );
}

export default Step4;