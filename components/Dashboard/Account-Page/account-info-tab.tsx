"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Edit2,
  EllipsisVertical,
  Eye,
  EyeOff,
  Lock,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { BankAccountCard } from "./bank-account-card";
import { useUserStore } from "@/store/user.store";
import { formatDate } from "@/lib/formatDate";
import { PersonalInfoTab } from "./personal-info-tab";
import Image from "next/image";
import {
  useUpdateAvatar,
  useUpdateProfile,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import { shortenUid } from "@/lib/shortenuid";
import { DatePicker } from "@/components/ui/reusable-date-picker";

export function AccountInfoTab() {
  const [showNumber, setShowNumber] = useState(false);
  const userData = useUserStore((state) => state.user);
  const [image, setImage] = useState<string | null>(null); // preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateAvatarMutate, isPending } = useUpdateAvatar();

  const [form, setForm] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    dob: "",
  });

  const banks = [
    {
      label: "Primary Account",
      bank: "GTCO",
      number: "0112345678",
      name: "Joseph Eyebiokin",
      status: "Verified",
    },
    {
      label: "Secondary Account",
      bank: "FCMB",
      number: "0112345678",
      name: "Joseph Eyebiokin",
      status: "Verified",
    },
    {
      label: "Business Account",
      bank: "Moniepoint",
      number: "0112345678",
      name: "Joseph Eyebiokin",
      status: "Verified",
    },
    {
      label: "New Account",
      bank: "Access",
      number: "0112345678",
      name: "Joseph Eyebiokin",
      status: "Under Review",
    },
  ];

  const {
    data: verificationData,
    isPending: verificationPending,
    error: verificationError,
  } = UseVerificationStatus();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  if (!file) return;

  // preview
  const preview = URL.createObjectURL(file);
  setImage(preview);

  // send to backend immediately
  updateAvatarMutate(file);
  };

  const handleUpdate = async (field: string, value: string) => {};

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="relative w-17.5 h-17.5 rounded-full bg-Green flex items-center justify-center text-white text-xl font-bold shrink-0 cursor-pointer overflow-hidden">
              {image ? (
                <Image
                  src={userData?.avatarUrl || image}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              ) : (
                "CJ"
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="absolute bottom-0 right-0 bg-black/60 p-1 rounded-full">
                <Edit2 className="w-3 h-3 text-white" />
              </div>
            </label>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-semibold leading-8 text-card-text">
                  {userData?.firstName}
                </h2>
                {verificationData?.data?.tierLevel === 0 && (
                  <Image width={60} height={19} alt="tier" src={"/Tier0.svg"} />
                )}
                {verificationData?.data?.tierLevel === 1 && (
                  <Image width={60} height={19} alt="tier" src={"/Tier1.svg"} />
                )}
                {verificationData?.data?.tierLevel === 2 && (
                  <Image width={60} height={19} alt="tier" src={"/Tier2.svg"} />
                )}
                {verificationData?.data?.tierLevel === 3 && (
                  <Image width={60} height={19} alt="tier" src={"/Tier3.svg"} />
                )}
              </div>
              <div className="flex items-center mt-1 gap-2">
                <p className="text-xs font-normal leading-5.5 text-text">
                  UID: {shortenUid(userData?.userId)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-text" />
                  <p className="text-xs font-medium leading-5.5 text-text">
                    Member since {formatDate(userData?.createdAt || "")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant={"outline"}
            size={"sm"}
            className="gap-2 text-Green border border-input transition-colors"
          >
            Edit Profile
          </Button>
        </div>
      </DashboardCard>

      {/* Linked Bank Accounts */}
      <DashboardCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] leading-6 font-medium text-card-text">
            Linked Bank Account
          </h3>
          <span className="text-xs text-text bg-border px-2.5 py-1 rounded-full">
            3 of 5 linked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {banks.map((b, i) => (
            <BankAccountCard
            key={i}
              index={i}
              label={b.label}
              status={b.status}
              bank={b.bank}
              number={b.number}
              name={b.name}
            />
          ))}
        </div>

        <div className="space-y-1 mx-auto w-fit">
          <button className="w-8 h-8 p-2 cursor-pointer flex items-center justify-center mx-auto gap-2 bg-[#042F2E] hover:bg-[#042F2E]/90 border border-[#0F766E] hover:border-[#0F766E]/5 py-3 rounded-[36px] text-sm text-text transition-colors">
            <Plus className="w-4 h-4 text-[#5EEAD4] hover:text-Green transition-colors" />
          </button>
          <p className="font-medium text-xs leading-5">Add new bank account</p>
        </div>
      </DashboardCard>

      {/* Personal Information */}
      <DashboardCard className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] leading-6 font-medium text-card-text">
              Personal Information
            </h3>
            <p className="text-[14px] leading-5.5 font-medium text-text mt-1">
              Last updated: {formatDate(userData?.createdAt ?? "")}
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-Green hover:underline">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-border p-5 rounded-lg">
          <PersonalInfoTab
            label="First Name"
            value={userData?.firstName || ""}
            onSave={(val) => handleUpdate("firstName", val)}
          />

          {/* ✅ Last Name */}
          <PersonalInfoTab
            label="Last Name"
            value={userData?.lastName || ""}
            onSave={(val) => handleUpdate("lastName", val)}
          />

          {/* ✅ Email */}
          <PersonalInfoTab
            label="Email Address"
            value={userData?.email || ""}
            onSave={(val) => handleUpdate("email", val)}
          />
          <PersonalInfoTab
            label="Phone Number"
            value={userData?.phoneNumber || ""}
            onSave={(val) => handleUpdate("email", val)}
          />

          {/* ✅ Date Picker */}
          <PersonalInfoTab
            label="Date of Birth"
            value={formatDate(userData?.dateOfBirth ?? "")}
            onSave={(val) => handleUpdate("dateOfBirth", val)}
            renderInput={(value, onChange) => (
              <DatePicker value={value} onChange={onChange} />
            )}
          />
          <PersonalInfoTab
            label="Gender"
            value={userData?.gender || ""}
            onSave={(val) => handleUpdate("gender", val)}
          />
          <PersonalInfoTab
            label="Nationality"
            value={userData?.country || ""}
            onSave={(val) => handleUpdate("country", val)}
          />
        </div>
      </DashboardCard>
    </div>
  );
}
