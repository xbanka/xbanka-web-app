"use client"
import { Copy, Edit2, Eye, EyeOff, Lock, Plus } from "lucide-react";
import { useState } from "react";

export function AccountInfoTab() {
  const [showNumber, setShowNumber] = useState(false);
 
  const banks = [
    { label: "Primary Account", bank: "GTCO", number: "0112345678", name: "Joseph Eyebiokin", status: "Verified" },
    { label: "Secondary Account", bank: "FCMB", number: "0112345678", name: "Joseph Eyebiokin", status: "Verified" },
    { label: "Business Account", bank: "Moniepoint", number: "0112345678", name: "Joseph Eyebiokin", status: "Verified" },
    { label: "New Account", bank: "", number: "0112345678", name: "Joseph Eyebiokin", status: "Under Review" },
  ];
 
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-Green flex items-center justify-center text-white text-xl font-bold shrink-0">
              CJ
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-card-text">CoolJoe</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Tier 2
                </span>
              </div>
              <p className="text-xs text-text mt-0.5">UID: 22345678</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-xs text-text">Member since Mar 7, 2023</p>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-Green border border-Green/30 hover:bg-Green/5 transition-colors px-4 py-2 rounded-xl">
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>
      </div>
 
      {/* Linked Bank Accounts */}
      <div className="bg-card-background border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-card-text">Linked Bank Account</h3>
          <span className="text-xs text-text bg-border px-2.5 py-1 rounded-full">3 of 5 linked</span>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {banks.map((b, i) => (
            <div key={i} className="border border-border rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-text uppercase tracking-wide">{b.label}</span>
                {b.status === "Verified" && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    Verified
                  </span>
                )}
                {b.status === "Under Review" && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    Under Review
                  </span>
                )}
              </div>
              {b.bank && <p className="text-sm font-bold text-card-text">{b.bank}</p>}
              <div className="space-y-1">
                <div>
                  <p className="text-[10px] text-text">Account Number</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-card-text">{b.number}</p>
                    <button className="text-text hover:text-Green transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-text">Account Name</p>
                  <p className="text-xs font-medium text-card-text">{b.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
 
        <button className="w-full flex items-center justify-center gap-2 border border-dashed border-border hover:border-border-active py-3 rounded-xl text-sm text-text hover:text-Green transition-colors">
          <Plus className="w-4 h-4" />
          Add new bank account
        </button>
      </div>
 
      {/* Personal Information */}
      <div className="bg-card-background border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-card-text">Personal Information</h3>
            <p className="text-xs text-text mt-0.5">Last updated: Mar 7, 2026</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-Green hover:underline">
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", value: "Joseph Eyebiokin", locked: false },
            { label: "Display Name", value: "CoolJoe", locked: false },
            { label: "Email Address", value: "Eye****@gmail.com", action: "Change", locked: false },
            {
              label: "Phone Number", value: showNumber ? "+234 708 *** 81" : "+234 708 *** **",
              locked: false, toggle: true,
            },
            { label: "Date of Birth", value: "23rd February, 2002", locked: true },
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
              <p className="text-[10px] font-semibold text-text uppercase tracking-wide">{field.label}</p>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${field.value === "Not yet provided" ? "text-text" : "text-card-text"}`}>
                  {field.value}
                </p>
                {field.locked && <Lock className="w-3 h-3 text-text" />}
                {(field as any).action && (
                  <button className="text-xs text-Green hover:underline">{(field as any).action}</button>
                )}
                {field.toggle && (
                  <button onClick={() => setShowNumber(v => !v)} className="text-text hover:text-Green transition-colors">
                    {showNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
      </div>
    </div>
  );
}