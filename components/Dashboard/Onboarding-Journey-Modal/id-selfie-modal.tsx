// import { Modal } from "@/components/ui/Modal";
// import { SuccessState } from "./success-state";
// import { ModalHeader } from "@/components/ui/modal-header";
// import { FormField } from "@/components/ui/FormField";
// import { Camera, IdCard } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { SelectField } from "@/components/ui/select";
// import { AttachmentUpload } from "@/components/ui/UploadAttachment";

// type IdSelfieStep = "id-form" | "id-success" | "selfie" | "selfie-success";
 
// export function IdSelfieModal({
//   onClose,
//   onCompleted,
// }: {
//   onClose: () => void;
//   onCompleted: () => void;
// }) {
//   const [step, setStep] = useState<IdSelfieStep>("id-form");
//   const [idType, setIdType] = useState("");
//   const [idNumber, setIdNumber] = useState("");
//   const [idFile, setIdFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
 
//   // Selfie camera state
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [selfieCapturing, setSelfieCapturing] = useState(false);
//   const [selfieLoading, setSelfieLoading] = useState(false);
 
//   // Start camera when on selfie step
//   useEffect(() => {
//     if (step !== "selfie") return;
//     navigator.mediaDevices
//       ?.getUserMedia({ video: true })
//       .then((s) => {
//         setStream(s);
//         if (videoRef.current) videoRef.current.srcObject = s;
//       })
//       .catch(() => {}); // graceful if no camera in preview
//     return () => {
//       stream?.getTracks().forEach((t) => t.stop());
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [step]);
 
//   const handleIdSubmit = async () => {
//     if (!idType || !idNumber || !idFile) return;
//     setLoading(true);
//     // TODO: replace with useIdentity() hook
//     await new Promise((r) => setTimeout(r, 1500));
//     setLoading(false);
//     setStep("id-success");
//   };
 
//   const handleTakeSelfie = async () => {
//     setSelfieCapturing(true);
//     await new Promise((r) => setTimeout(r, 1000));
//     setSelfieCapturing(false);
//     setSelfieLoading(true);
//     // TODO: replace with useVerifySelfie() hook
//     await new Promise((r) => setTimeout(r, 1500));
//     setSelfieLoading(false);
//     stream?.getTracks().forEach((t) => t.stop());
//     setStep("selfie-success");
//   };
 
//   const stepTitles: Record<IdSelfieStep, string> = {
//     "id-form": "Select Your Preferred ID",
//     "id-success": "ID Submitted",
//     selfie: "Take a Selfie",
//     "selfie-success": "Selfie Captured",
//   };
 
//   return (
//     <Modal onClose={onClose}>
//       {/* ── ID FORM ─────────────────────────────────────── */}
//       {step === "id-form" && (
//         <>
//           <ModalHeader
//             title={stepTitles["id-form"]}
//             subtitle="Verify your identity to unlock your wallet"
//             onClose={onClose}
//           />
//           <div className="px-8 py-6 space-y-4">
//             <SelectField
//               label="ID Type"
//               placeholder="Select ID type"
//               options={[
//                 { value: "nin", label: "NIN" },
//                 {
//                   value: "international_passport",
//                   label: "International Passport",
//                 },
//                 { value: "drivers_license", label: "Driver's License" },
//                 { value: "voters_card", label: "Voter's Card" },
//               ]}
//               value={idType}
//               onChange={setIdType}
//             />
//             <FormField
//               label="ID Number"
//               placeholder="Enter ID number"
//               icon={IdCard}
//               value={idNumber}
//             />
//             <AttachmentUpload
//               label="Upload ID Document"
//               file={idFile}
//               onChange={setIdFile}
//             />
 
//             <div className="flex gap-3 pt-1">
//               <Button variant="outline" onClick={onClose} className="flex-1">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleIdSubmit}
//                 disabled={!idType || !idNumber || !idFile}
//                 className="flex-[3]"
//               >
//                 {loading ? "" : "Continue"}
//               </Button>
//             </div>
//             <Button className="w-full text-center text-xs text-[#36b6ab] font-medium hover:underline">
//               Skip for later
//             </Button>
//           </div>
//         </>
//       )}
 
//       {/* ── ID SUCCESS ──────────────────────────────────── */}
//       {step === "id-success" && (
//         <SuccessState
//           title="ID Submitted ✅"
//           subtitle="Your document has been submitted successfully. Next, take a quick selfie so we can match it with your ID."
//           badge="review"
//           ctaLabel="Continue to Selfie"
//           onCta={() => setStep("selfie")}
//           onClose={onClose}
//         />
//       )}
 
//       {/* ── SELFIE ──────────────────────────────────────── */}
//       {step === "selfie" && (
//         <>
//           <ModalHeader
//             title="Almost Done! Let's take a Selfie"
//             subtitle="We'll match your photo with your ID to confirm it's really you."
//             onBack={() => setStep("id-success")}
//             onClose={onClose}
//           />
//           <div className="px-8 py-6 space-y-4">
//             {/* Camera viewport */}
//             <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#141820] border border-[#2a3040] flex items-center justify-center">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 muted
//                 playsInline
//                 className="w-full h-full object-cover"
//               />
//               {!stream && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#8b95a8]">
//                   <Camera className="w-8 h-8" />
//                   <p className="text-xs">Camera preview</p>
//                 </div>
//               )}
//               {selfieCapturing && (
//                 <div className="absolute inset-0 bg-white/20 animate-pulse" />
//               )}
//             </div>
 
//             <p className="text-xs text-[#8b95a8] text-center">
//               Good lighting. Neutral background. No hats or glasses.
//             </p>
 
//             <div className="flex gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setStep("id-success")}
//                 className="flex-1"
//               >
//                 Back
//               </Button>
//               <Button
//                 onClick={handleTakeSelfie}
//                 className="flex-[3]"
//               >
//                 {selfieCapturing || selfieLoading ? "" : (
//                   <>
//                     <Camera className="w-4 h-4" /> Take Selfie
//                   </>
//                 )}
//               </Button>
//             </div>
//             <button className="w-full text-center text-xs text-[#36b6ab] font-medium hover:underline">
//               Skip for later
//             </button>
//           </div>
//         </>
//       )}
 
//       {/* ── SELFIE SUCCESS ──────────────────────────────── */}
//       {step === "selfie-success" && (
//         <SuccessState
//           title="Selfie Captured! 📸"
//           subtitle="Great shot! Your selfie has been matched with your ID. You can now proceed to verify your address."
//           badge="verified"
//           ctaLabel="Move to Proof of Address"
//           onCta={() => {
//             onClose();
//             onCompleted();
//           }}
//           onClose={onClose}
//         />
//       )}
//     </Modal>
//   );
// }