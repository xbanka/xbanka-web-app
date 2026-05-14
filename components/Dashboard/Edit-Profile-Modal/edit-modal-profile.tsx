"use client";

import { useState } from "react";
import {
  X,
  Camera,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Lock,
  Sidebar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/select";
import { SidebarWrapper } from "@/components/ui/sidebar";
import { ModalHeader } from "@/components/ui/modal-header";

interface EditProfileModalProps {
  onClose: () => void;
  defaultValues?: {
    displayName?: string;
    gender?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    dateOfBirth?: string;
    countryOfResidence?: string;
    address?: string;
  };
  avatarUrl?: string;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Prefer not to say" },
];

export function EditProfileModal({
  onClose,
  defaultValues = {
    displayName: "Cooljoe",
    gender: "male",
    fullName: "Joseph Eyebiokin",
    phone: "+234 700 000 000",
    email: "Eyebiokin.joseph1@gmail.com",
    dateOfBirth: "",
    countryOfResidence: "Nigeria",
    address: "",
  },
  avatarUrl,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(
    defaultValues.displayName ?? "",
  );
  const [gender, setGender] = useState(defaultValues.gender ?? "");
  const [phone, setPhone] = useState(defaultValues.phone ?? "");
  const [address, setAddress] = useState(defaultValues.address ?? "");

  return (
    <SidebarWrapper onClose={onClose} open={true}>
      {/* Header */}
      <ModalHeader title="Edit Profile" onClose={onClose} />

      <div className="pt-6 pb-10 px-10 max-h-180 overflow-y-scroll">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative w-20 h-20">
            <div className="w-20 h-20 rounded-full bg-input overflow-hidden border-2 border-border-active">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-Green/20 text-Green text-2xl font-bold">
                  {(defaultValues.fullName ?? "U")[0]}
                </div>
              )}
            </div>
            {/* Camera badge */}
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-Green border-2 border-card-background flex items-center justify-center hover:bg-Green/90 transition-colors">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <span className="mt-2.5 text-[12px] text-Green font-medium cursor-pointer hover:text-Green/80 transition-colors">
            Change photo
          </span>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Row 1: Display Name + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="displayName"
              label="Display Name"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <SelectField
              id="gender"
              label="Gender"
              placeholder="Select gender"
              options={genderOptions}
            />
          </div>

          {/* Full Name — locked */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label label="Full Name" />
              <span className="flex items-center gap-1 text-[11px] text-disabled-text">
                <Lock className="w-3 h-3" />
                Cannot be changed
              </span>
            </div>
            <FormField
              id="fullName"
              placeholder="Full Name"
              value={defaultValues.fullName}
              disabled
              icon={Lock}
            />
          </div>

          {/* Phone Number */}
          <FormField
            id="phone"
            label="Phone Number"
            placeholder="+234 000 000 000"
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Email — locked */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label label="Email Address" />
            </div>
            <FormField
              id="email"
              type="email"
              placeholder="email@example.com"
              icon={Mail}
              value={defaultValues.email}
              disabled
            />
          </div>

          {/* Date of Birth — locked */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label label="Date of Birth" />
              <span className="flex items-center gap-1 text-[11px] text-disabled-text">
                <Lock className="w-3 h-3" />
                Cannot be changed
              </span>
            </div>
            <FormField
              id="dateOfBirth"
              type="date"
              placeholder="Date of Birth"
              icon={Calendar}
              value={defaultValues.dateOfBirth}
              disabled
            />
          </div>

          {/* Country of Residence — locked */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label label="Country of Residence" />
              <span className="flex items-center gap-1 text-[11px] text-disabled-text">
                <Lock className="w-3 h-3" />
                Cannot be changed
              </span>
            </div>
            <FormField
              id="country"
              placeholder="Country"
              icon={MapPin}
              value={defaultValues.countryOfResidence}
              disabled
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label label="Address" />
              <span className="inline-flex items-center rounded-md bg-[#C19700]/15 border border-[#C19700]/40 px-2 py-0.5 text-[11px] font-medium text-[#C19700]">
                Tier 3 Required
              </span>
            </div>
            <FormField
              id="address"
              placeholder="Enter Address"
              icon={MapPin}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-8">
          <Button
            variant="outline"
            size="default"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button variant="default" size="default" className="flex-1">
            Save Changes
          </Button>
        </div>
      </div>
    </SidebarWrapper>
  );
}
