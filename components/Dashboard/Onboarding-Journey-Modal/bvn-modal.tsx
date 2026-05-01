// import { Modal } from "@/components/ui/Modal";
// import { SuccessState } from "./success-state";
// import { ModalHeader } from "@/components/ui/modal-header";
// import { IdCard, Shield } from "lucide-react";
// import { FormField } from "@/components/ui/FormField";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// export function BvnModal({
//   onClose,
//   onCompleted,
// }: {
//   onClose: () => void;
//   onCompleted: () => void;
// }) {
//   const [bvn, setBvn] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState<"form" | "success">("form");
//   const [successType, setSuccessType] = useState<"verified" | "review">(
//     "verified"
//   );
 
//   const handleSubmit = async () => {
//     if (bvn.length < 11) return;
//     setLoading(true);
//     // TODO: replace simulation with your real hook
//     // const { mutate: verifyBvn } = useVerifyBvn()
//     // verifyBvn({ userId, bvn }, { onSuccess: () => setStep("success") })
//     await new Promise((r) => setTimeout(r, 1500));
//     setLoading(false);
//     // simulate: sometimes "under review"
//     setSuccessType(Math.random() > 0.5 ? "verified" : "review");
//     setStep("success");
//   };
 
//   return (
//     <Modal onClose={onClose}>
//       {step === "form" && (
//         <>
//           <ModalHeader
//             title="Verify Your BVN"
//             subtitle="Your BVN helps us confirm your name and date of birth."
//             onClose={onClose}
//           />
//           <div className="px-8 py-6 space-y-5">
//             <div className="bg-[#141820] border border-[#2a3040] rounded-xl p-4 flex gap-3">
//               <Shield className="w-4 h-4 text-[#36b6ab] mt-0.5 flex-shrink-0" />
//               <p className="text-xs text-[#8b95a8] leading-relaxed">
//                 We&apos;ll never share your BVN with anyone. It&apos;s only
//                 used to confirm your identity.
//               </p>
//             </div>
 
//             <FormField
//               label="Bank Verification Number (BVN)"
//               placeholder="Enter your 11-digit BVN"
//               icon={IdCard}
//               value={bvn}
//               onChange={setBvn}
//               error={
//                 bvn.length > 0 && bvn.length < 11
//                   ? "BVN must be 11 digits"
//                   : undefined
//               }
//             />
 
//             <div className="flex gap-3 pt-1">
//               <Button variant="outline" onClick={onClose} className="flex-1">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={bvn.length < 11}
//                 className="flex-[3]"
//               >
//                 {loading ? "" : "Continue"}
//               </Button>
//             </div>
 
//             <button className="w-full text-center text-xs text-[#36b6ab] font-medium hover:underline">
//               Skip for later
//             </button>
//           </div>
//         </>
//       )}
 
//       {step === "success" && (
//         <SuccessState
//           title={
//             successType === "verified"
//               ? "BVN Verified! ✅"
//               : "BVN Under Review"
//           }
//           subtitle={
//             successType === "verified"
//               ? "Your BVN has been successfully verified. You can now proceed to the next step."
//               : "We're reviewing your BVN. This usually takes a few minutes. You'll be notified once done."
//           }
//           badge={successType}
//           ctaLabel="Move to ID & Selfie"
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