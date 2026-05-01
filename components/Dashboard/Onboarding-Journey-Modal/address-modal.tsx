// import { Button } from "@/components/ui/button";
// import { FormField } from "@/components/ui/FormField";
// import { Modal } from "@/components/ui/Modal";
// import { ModalHeader } from "@/components/ui/modal-header";
// import { SelectField } from "@/components/ui/select";
// import { AttachmentUpload } from "@/components/ui/UploadAttachment";
// import { MapPin } from "lucide-react";
// import { useState } from "react";
// import { SuccessState } from "./success-state";

// export function AddressModal({
//   onClose,
//   onCompleted,
// }: {
//   onClose: () => void;
//   onCompleted: () => void;
// }) {
//   const [step, setStep] = useState<"form" | "success">("form");
//   const [address, setAddress] = useState("");
//   const [landmark, setLandmark] = useState("");
//   const [country, setCountry] = useState("");
//   const [state, setState] = useState("");
//   const [docType, setDocType] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
 
//   const canSubmit =
//     address && country && state && docType && file;
 
//   const handleSubmit = async () => {
//     if (!canSubmit) return;
//     setLoading(true);
//     // TODO: replace with useAddressProof() hook
//     await new Promise((r) => setTimeout(r, 1500));
//     setLoading(false);
//     setStep("success");
//   };
 
//   return (
//     <Modal onClose={onClose}>
//       {step === "form" && (
//         <>
//           <ModalHeader
//             title="Proof of Address"
//             subtitle="Please provide the address exactly as it appears on your document"
//             onClose={onClose}
//           />
//           <div className="px-8 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
//             <FormField
//               label="Street Address"
//               placeholder="Enter Address"
//               icon={MapPin}
//               value={address}
//               onChange={setAddress}
//             />
//             <FormField
//               label="Popular Landmark (optional)"
//               placeholder="e.g. Behind First Bank, Lekki"
//               icon={MapPin}
//               value={landmark}
//               onChange={setLandmark}
//             />
//             <div className="grid grid-cols-2 gap-3">
//               <SelectField
//                 label="Country"
//                 placeholder="Country"
//                 options={[
//                   { value: "ng", label: "Nigeria" },
//                   { value: "gh", label: "Ghana" },
//                 ]}
//                 value={country}
//                 onChange={setCountry}
//               />
//               <SelectField
//                 label="State"
//                 placeholder="State"
//                 options={[
//                   { value: "lag", label: "Lagos" },
//                   { value: "abj", label: "Abuja" },
//                   { value: "ph", label: "Port Harcourt" },
//                   { value: "kno", label: "Kano" },
//                 ]}
//                 value={state}
//                 onChange={setState}
//               />
//             </div>
//             <SelectField
//               label="Document Type"
//               placeholder="Select document of choice"
//               options={[
//                 { value: "utility_bill", label: "Utility Bill" },
//                 { value: "bank_statement", label: "Bank Statement" },
//                 { value: "tenancy_agreement", label: "Tenancy Agreement" },
//               ]}
//               value={docType}
//               onChange={setDocType}
//             />
//             <AttachmentUpload
//               label="Upload Document"
//               file={file}
//               onChange={setFile}
//             />
 
//             <div className="flex gap-3 pt-1">
//               <Button variant="outline" onClick={onClose} className="flex-1">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={!canSubmit}
//                 className="flex-[3]"
//               >
//                 {loading ? "" : "Submit"}
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
//           title="You're all set! 🎉"
//           subtitle="Your address has been submitted. Your account is now fully set up and ready to use."
//           badge="verified"
//           ctaLabel="Go to Dashboard"
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