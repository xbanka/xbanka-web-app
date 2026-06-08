"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Mail,
  Calendar,
  MapPin,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/select";
import { SidebarWrapper } from "@/components/ui/sidebar";
import { ModalHeader } from "@/components/ui/modal-header";
import { COUNTRIES, Country, countryOptions } from "@/lib/countries";
import PhoneNumberField from "@/components/ui/Phonenumberfield";
import z from "zod";
import {
  UseProfileUser,
  useUpdateAvatar,
  useUpdateProfile,
} from "@/lib/services/profile.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

interface EditProfileModalProps {
  onClose: () => void;
  defaultValues?: {
    displayName?: string;
    gender?: string;
    firstName?: string;
    lastName?: string;
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

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  phoneNumber: z.string().min(6, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Country is required"),
});

type FormValues = z.infer<typeof schema>;

export function EditProfileModal({
  onClose,
}: EditProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<string | null>(null); // preview

  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const { data: profileData } = UseProfileUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: updateAvatarMutate, isPending: updateAvatarPending } =
    useUpdateAvatar();
  const avatar = profileData?.data?.avatarUrl;
  const profile = profileData?.data;
  const bvnVerified = profile?.kycStatus?.bvnVerified;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phoneNumber: "",
      dateOfBirth: "",
      country: "",
    },
  });

  useEffect(() => {
    if (!profile) return;

    const countryValue =
      countryOptions.find(
        (option) =>
          option.value.toLowerCase() === profile.country?.toLowerCase(),
      )?.value || "";
    reset({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      gender: profile.gender || "",
      phoneNumber: profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
      country: countryValue || "",
    });
  }, [profile, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview
    const preview = URL.createObjectURL(file);
    setImage(preview);

    // send to backend immediately
    updateAvatarMutate(file);
  };

  const onSubmit = (values: FormValues) => {
    if (!profile?.userId) return;

    updateProfile(
      {
        userId: profile.userId,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        phoneNumber: values.phoneNumber,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
        country: values.country,
        profilePicture: null,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <SidebarWrapper onClose={onClose} open={true}>
      {/* Header */}
      <ModalHeader
        title="Edit Profile"
        onClose={onClose}
        className="shrink-0 max-sm:px-5 max-sm:py-5"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-0 flex-1 overflow-y-auto px-10 pb-10 pt-4 sm:pt-6 max-sm:px-5 max-sm:pb-0 max-sm:pt-1"
      >
        {/* Avatar */}
        <div className="mb-5 flex flex-col items-center max-sm:mb-4">
          <div className="relative h-20 w-20 max-sm:h-18 max-sm:w-18">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-border-active bg-input text-xl font-semibold text-card-text max-sm:h-18 max-sm:w-18">
              {image || avatar ? (
                <Image
                  src={image || avatar}
                  alt="profile"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                `${profile?.firstName?.[0] || ""}${profile?.lastName?.[0] || ""}` ||
                profile?.email[0]
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {/* Camera badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card-background bg-Green transition-colors hover:bg-Green/90"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2.5 cursor-pointer text-[12px] font-medium text-Green transition-colors hover:text-Green/80"
          >
            {updateAvatarPending ? "Uploading..." : "Change photo"}
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 max-sm:space-y-3.5">
          {/* Row 1: Display Name + Gender */}
          {/* <div className="grid grid-cols-2 gap-3">
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
          </div> */}

          {/* Full Name — locked */}
          <div className="space-y-2">
            {bvnVerified && (
              <div className="flex items-center justify-end max-sm:justify-start">
                <span className="flex items-center gap-1 text-[11px] text-disabled-text">
                  <Lock className="w-3 h-3" />
                  Locked after BVN verification
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 items-start gap-4 max-[420px]:grid-cols-1 max-[420px]:gap-3">
              <FormField
                id="firstName"
                label="First Name"
                placeholder="First Name"
                className="w-full"
                register={register}
                error={errors.firstName}
                readOnly={bvnVerified}
                disabled={bvnVerified}
              />
              <FormField
                id="lastName"
                label="Last Name"
                placeholder="Last Name"
                className="w-full"
                register={register}
                error={errors.lastName}
                readOnly={bvnVerified}
                disabled={bvnVerified}
              />
            </div>
          </div>

          <SelectField
            id="gender"
            label="Gender"
            placeholder="Select gender"
            options={genderOptions}
            register={register}
            error={errors.gender}
          />

          {/* Phone Number */}
          <PhoneNumberField
            selectedCountry={country}
            onCountryChange={setCountry}
            id="phoneNumber"
            placeholder="Phone number"
            register={register}
            error={errors.phoneNumber}
          />

          {/* Email — locked */}
          <FormField
            id="email"
            type="email"
            label="Email Address"
            placeholder="email@example.com"
            icon={Mail}
            value={profile?.email || ""}
            // disabled={bvnVerified}
          />

          {/* Date of Birth — locked */}
          <div className="space-y-1">
            {/* <div className="flex items-center justify-between">
              <Label label="Date of Birth" />
              <span className="flex items-center gap-1 text-[11px] text-disabled-text">
                <Lock className="w-3 h-3" />
                Cannot be changed
              </span>
            </div> */}
            <FormField
              id="dateOfBirth"
              type="date"
              label="Date of Birth"
              icon={Calendar}
              register={register}
              error={errors.dateOfBirth}
            />
          </div>

          {/* Country of Residence — locked */}
          <div className="space-y-1">
            {/* <div className="flex items-center justify-between">
              <Label label="Country of Residence" />
              <span className="flex items-center gap-1 text-[11px] text-disabled-text">
                <Lock className="w-3 h-3" />
                Cannot be changed
              </span>
            </div> */}
            <SelectField
              id="country"
              label="Country"
              placeholder="Country"
              options={countryOptions}
              register={register}
              error={errors.country}
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
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
        <div className="mt-8 flex items-center gap-3 max-sm:sticky max-sm:bottom-0 max-sm:z-10 max-sm:-mx-5 max-sm:bg-card-background max-sm:px-5 max-sm:pb-[calc(env(safe-area-inset-bottom)+16px)] max-sm:pt-4">
          <Button
            type="button"
            variant="outline"
            size="default"
            className="flex-1 max-sm:h-11"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={isPending ? "disabled" : "default"}
            size="default"
            disabled={isPending}
            className="flex-[2] max-sm:h-11"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </SidebarWrapper>
  );
}
