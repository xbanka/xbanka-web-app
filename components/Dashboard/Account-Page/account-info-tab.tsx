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
import { Label } from "@/components/ui/label";

export function AccountInfoTab() {
  const [showNumber, setShowNumber] = useState(false);

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

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-17.5 h-17.5 rounded-full bg-Green flex items-center justify-center text-white text-xl font-bold shrink-0">
              CJ
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-semibold leading-8 text-card-text">
                  CoolJoe
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Tier 2
                </span>
              </div>
              <div className="flex items-center mt-1 gap-2">
                <p className="text-xs font-normal leading-5.5 text-text">
                  UID: 22345678
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-text" />
                  <p className="text-xs font-medium leading-5.5 text-text">
                    Member since Mar 7, 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant={"outline"}
            className="flex items-center gap-2 text-Green border border-input transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
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
              Last updated: Mar 7, 2026
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-Green hover:underline">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-border p-5 rounded-lg">
          {[
            { label: "Full Name", value: "Joseph Eyebiokin", locked: false },
            { label: "Display Name", value: "CoolJoe", locked: false },
            {
              label: "Email Address",
              value: "Eye****@gmail.com",
              action: "Change",
              locked: false,
            },
            {
              label: "Phone Number",
              value: showNumber ? "+234 708 *** 81" : "+234 708 *** **",
              locked: false,
              toggle: true,
            },
            {
              label: "Date of Birth",
              value: "23rd February, 2002",
              locked: true,
            },
            { label: "Gender", value: "Male", locked: true },
            {
              label: "Address",
              value: "Not yet provided",
              note: "Complete tier 3 verification by adding your address",
              badge: "Tier 3 Required",
              locked: false,
            },
            { label: "Nationality", value: "Nigerian", locked: true },
          ].map((field, i) => (
            <div key={i} className="space-y-1">
              <Label label={field.label} />
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-medium ${field.value === "Not yet provided" ? "text-text" : "text-card-text"}`}
                >
                  {field.value}
                </p>
                {field.locked && <Lock className="w-3 h-3 text-text" />}
                {(field as any).action && (
                  <button className="text-xs text-Green hover:underline">
                    {(field as any).action}
                  </button>
                )}
                {field.toggle && (
                  <button
                    onClick={() => setShowNumber((v) => !v)}
                    className="text-text hover:text-Green transition-colors"
                  >
                    {showNumber ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
                {(field as any).badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    {(field as any).badge}
                  </span>
                )}
              </div>
              {(field as any).note && (
                <p className="text-[10px] text-text">{(field as any).note}</p>
              )}
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
