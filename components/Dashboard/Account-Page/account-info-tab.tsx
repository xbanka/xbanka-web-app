"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Copy,
  Edit2,
  Lock,
  Info,
  Plus,
  WalletMinimal,
} from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/store/user.store";
import { formatDate } from "@/lib/formatDate";
import { PersonalInfoTab } from "./personal-info-tab";
import Image from "next/image";
import { toast } from "sonner";
import {
  UseProfileUser,
  useUpdateAvatar,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import { shortenUid } from "@/lib/shortenuid";
import { UseGetVirtualAccount } from "@/lib/services/wallet.service";
import { MapleradBankAccount } from "./types";
import { AddBankModal } from "./add-bank-modal";
import { BankAccountSkeleton } from "./bank-account-skeleton";
import { EditProfileModal } from "./edit-modal-profile";
import { FundingAccountDetailsLayout } from "./funding-account-details-layout";

const maskEmail = (email?: string) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 3)}****@${domain}`;
};

const maskPhone = (phone?: string) => {
  if (!phone) return "";
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, phone.length - 6)} *** ${phone.slice(-2)}`;
};

export function AccountInfoTab() {
  const userData = useUserStore((state) => state.user);
  const [image, setImage] = useState<string | null>(null); // preview
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [uidCopied, setUidCopied] = useState(false);
  const { mutate: updateAvatarMutate } = useUpdateAvatar();
  const { data: profileData } = UseProfileUser();
  const avatar = profileData?.data?.avatarUrl;

  const {
    data: virtualAccountData,
    isPending: virtualAccountPending,
    error: virtualAccountError,
  } = UseGetVirtualAccount();

  const { data: verificationData } = UseVerificationStatus();
  const tierLevel = verificationData?.data?.tierLevel ?? 0;

  const account: MapleradBankAccount =
    virtualAccountData?.data?.data?.[0] ||
    virtualAccountData?.data?.data ||
    virtualAccountData?.data;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    updateAvatarMutate(file);
  };

  const handleEditModal = () => setEditProfileModal(true);

  const handleCopyUid = () => {
    navigator.clipboard?.writeText(String(userData?.userId ?? ""));
    setUidCopied(true);
    setTimeout(() => setUidCopied(false), 1500);
  };

  const copyAccountNumber = () => {
    if (!account?.address) return;
    navigator.clipboard?.writeText(String(account.address));
    toast.success("Account number copied");
  };

  const copyAccountDetails = () => {
    if (!account) return;
    const details = [
      `Bank Name: ${account.bankName}`,
      `Account Name: ${account.accountName}`,
      `Account Number: ${account.address}`,
      `Account Type: Virtual Account`,
      `Currency: NGN`,
    ].join("\n");
    navigator.clipboard?.writeText(details);
    toast.success("Account details copied");
  };

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="relative w-17.5 h-17.5 rounded-full bg-Green flex items-center justify-center text-white text-xl font-bold shrink-0 cursor-pointer overflow-hidden">
              {image || avatar ? (
                <Image
                  src={image || avatar}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              ) : (
                `${userData?.firstName?.[0] || ""}${userData?.lastName?.[0] || ""}` ||
                userData?.email?.[0]
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="absolute bottom-0 right-0 bg-black/60 p-1 rounded-full">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </label>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-semibold leading-8 text-card-text">
                  {userData?.firstName}
                </h2>
                <Image
                  width={60}
                  height={19}
                  alt="tier"
                  src={`/Tier${tierLevel}.svg`}
                />
              </div>
              <div className="flex items-center mt-1 gap-2">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-normal leading-5.5 text-text">
                    UID: {shortenUid(userData?.userId)}
                  </p>
                  <button
                    onClick={handleCopyUid}
                    className="text-text hover:text-Green transition-colors"
                  >
                    <Copy
                      className={`w-3 h-3 ${uidCopied ? "text-Green" : ""}`}
                    />
                  </button>
                </div>
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
            onClick={handleEditModal}
            className="gap-2 text-Green border border-input transition-colors"
          >
            Edit Profile
          </Button>
        </div>
      </DashboardCard>

      {/* Deposit & Withdrawal Account */}
      <DashboardCard className="space-y-4">
        <h3 className="text-[16px] leading-6 font-medium text-card-text pb-4 border-b border-border">
          Deposit & Withdrawal Account
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x lg:divide-border">
          {/* Xbanka Funding Account */}
          <div className="space-y-4 lg:pr-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-sm leading-5 text-card-text">
                  Xbanka Funding Account
                </p>
                <p className="font-normal text-xs leading-5 text-text mt-0.5">
                  Transfer money to this account to fund your NGN Wallet
                </p>
              </div>
              {account && !virtualAccountError && (
                <span className="text-[12px] font-normal px-2 py-0.5 rounded-md bg-green-success-light text-green-success-text border border-green-success-border shrink-0">
                  Active
                </span>
              )}
            </div>

            {virtualAccountPending && <BankAccountSkeleton />}

            {!virtualAccountPending && !account && virtualAccountError && (
              <div className="bg-border rounded-lg p-5 text-center text-card-text text-sm font-medium">
                {virtualAccountError?.message || "Failed to load account"}
              </div>
            )}

            {account && !virtualAccountPending && (
              <>
                <div className="bg-border rounded-lg p-5 space-y-3">
                  <FundingAccountDetailsLayout
                    label="Bank Name"
                    value={account.bankName}
                  />
                  <FundingAccountDetailsLayout
                    label="Account Name"
                    value={account.accountName}
                  />
                  <FundingAccountDetailsLayout
                    label="Account Number"
                    value={account.address || "-"}
                  />
                  <FundingAccountDetailsLayout
                    label="Account Type"
                    value="Virtual Account"
                  />
                  <FundingAccountDetailsLayout label="Currency" value="NGN" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAccountNumber}
                    className="gap-2 text-Green"
                  >
                    <Copy className="w-4 h-4" />
                    Copy account number
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAccountDetails}
                    className="gap-2 text-Green"
                  >
                    <Copy className="w-4 h-4" />
                    Copy account details
                  </Button>
                </div>

                <div className="flex items-center gap-2 bg-border/60 rounded-lg px-4 py-3">
                  <Info className="w-4 h-4 text-text shrink-0" />
                  <p className="text-xs font-normal leading-5 text-text">
                    This account is uniquely assigned to you for NGN wallet
                    funding
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Withdrawal Account */}
          <div className="space-y-4 lg:pl-6">
            <div>
              <p className="font-medium text-sm leading-5 text-card-text">
                Withdrawal Account
              </p>
              <p className="font-normal text-xs leading-5 text-text mt-0.5">
                Transfer money to this account to fund your NGN Wallet
              </p>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-2">
              <WalletMinimal className="w-10 h-10 text-text/60 mb-1" />
              <p className="text-sm font-medium leading-5 text-card-text">
                No Withdrawal account added
              </p>
              <p className="text-xs font-normal leading-5 text-text max-w-xs">
                Add a personal account to withdraw funds from your NGN wallet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenAccountModal(true)}
                className="mt-2 gap-2 text-Green"
              >
                <Plus className="w-4 h-4" />
                Add withdrawal account
              </Button>
            </div>
          </div>
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
              Last updated:{" "}
              {formatDate(userData?.updatedAt ?? userData?.createdAt ?? "")}
            </p>
          </div>
          <button
            onClick={handleEditModal}
            className="flex items-center gap-1.5 text-xs text-Green hover:underline"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-border p-5 rounded-lg">
          <PersonalInfoTab
            label="Full Name"
            value={
              `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim() ||
              "-"
            }
          />
          <PersonalInfoTab
            label="Display Name"
            value={userData?.firstName || "-"}
          />

          <PersonalInfoTab
            label="Email Address"
            value={maskEmail(userData?.email) || "-"}
            action={
              <button
                onClick={handleEditModal}
                className="text-xs text-Green hover:underline"
              >
                Change
              </button>
            }
          />
          <PersonalInfoTab
            label="Phone Number"
            value={maskPhone(userData?.phoneNumber) || "-"}
            action={
              <button
                onClick={handleEditModal}
                className="text-xs text-Green hover:underline"
              >
                Change
              </button>
            }
          />

          <PersonalInfoTab
            label="Date of Birth"
            value={formatDate(userData?.dateOfBirth ?? "") || "-"}
            action={<Lock className="w-3.5 h-3.5 text-text" />}
          />
          <PersonalInfoTab label="Gender" value={userData?.gender || "-"} />

          <PersonalInfoTab
            label="Address"
            value={userData?.state || "Not yet provided"}
            subtitle={
              userData?.state
                ? undefined
                : "Complete tier 3 verification by adding your address"
            }
            action={
              !userData?.state && tierLevel < 3 ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 whitespace-nowrap">
                  Tier 3 Required
                </span>
              ) : undefined
            }
          />
          <PersonalInfoTab
            label="Nationality"
            value={userData?.country || "-"}
            action={<Lock className="w-3.5 h-3.5 text-text" />}
          />
        </div>

        {openAccountModal && (
          <AddBankModal
            onClose={() => setOpenAccountModal(false)}
            open={openAccountModal}
          />
        )}

        {editProfileModal && (
          <EditProfileModal onClose={() => setEditProfileModal(false)} />
        )}
      </DashboardCard>
    </div>
  );
}
