export const SAVED_BANKS = [
  { id: "gtb", bank: "GTB", masked: "GTB-·······890", name: "Joseph Eyebiokin", color: "bg-orange-500", isDefault: true },
  { id: "uba", bank: "UBA", masked: "UBA-·······890", name: "Joseph Eyebiokin", color: "bg-red-600", isDefault: false },
];
 
export const SAVED_CARDS = [
  { id: "gtb_card", bank: "GTB", masked: "·· ·· ·· ··890", name: "Joseph Eyebiokin", color: "bg-orange-500", isDefault: true, expiry: "12/27", type: "Visa" },
  { id: "uba_card", bank: "UBA", masked: "·· ·· ·· ··123", name: "Joseph Eyebiokin", color: "bg-red-600", isDefault: false, expiry: "08/26", type: "Mastercard" },
];
 
export const QUICK_AMOUNTS = [5_000, 10_000, 50_000, 100_000, 150_000];
 
const BANK_AVATAR_COLORS = [
  "bg-orange-500",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-pink-500",
  "bg-amber-500",
];

export const bankColor = (name: string) => {
  if (!name) return BANK_AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) | 0;
  return BANK_AVATAR_COLORS[Math.abs(hash) % BANK_AVATAR_COLORS.length];
};

export const bankInitials = (name: string) =>
  (name || "")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

export const BANK_OPTIONS = [
  { value: "gtb", label: "GTBank" },
  { value: "access", label: "Access Bank" },
  { value: "zenith", label: "Zenith Bank" },
  { value: "firstbank", label: "First Bank" },
  { value: "uba", label: "UBA" },
  { value: "fcmb", label: "FCMB" },
  { value: "sterling", label: "Sterling Bank" },
  { value: "moniepoint", label: "Moniepoint" },
  { value: "kuda", label: "Kuda" },
];