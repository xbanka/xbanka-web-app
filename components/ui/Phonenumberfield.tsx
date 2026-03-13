"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { COUNTRIES, Country } from "@/lib/countries";
import { ErrorField } from "./field-error";

interface PhoneNumberFieldProps {
  id: string;
  label?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  disabled?: boolean;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
}

export default function PhoneNumberField({
  id,
  label,
  placeholder = "Enter phone number",
  register,
  error,
  disabled = false,
  selectedCountry,
  onCountryChange,
}: PhoneNumberFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom",
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const DROPDOWN_HEIGHT = 320; // approximate max height of dropdown

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate whether dropdown should open upward or downward
  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > spaceBelow) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  };

  const handleOpen = () => {
    if (disabled) return;
    calculatePosition();
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculate on scroll / resize while open
  useEffect(() => {
    if (!isOpen) return;
    const handle = () => calculatePosition();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [isOpen]);

  const handleSelectCountry = (country: Country) => {
    onCountryChange(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  const inputBase =
    "flex items-center h-10 w-full min-w-0 rounded-lg border bg-input-background px-4 py-2.5 text-sm text-card-text placeholder:text-placeholder outline-none shadow-xs transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-card-text"
        >
          {label}
        </label>
      )}

      <div className="flex gap-2 items-start">
        {/* ── Country selector ───────────────────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            ref={triggerRef}
            type="button"
            onClick={handleOpen}
            disabled={disabled}
            className={`${inputBase} border-input focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 w-auto gap-2 cursor-pointer hover:border-border-active disabled:cursor-not-allowed
              ${isOpen ? "border-border-active ring-[3px] ring-border-active/20" : ""}`}
          >
            <span className="text-lg leading-none">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-card-text min-w-10">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-placeholder transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* ── Dropdown ──────────────────────────────────────────── */}
          {isOpen && (
            <div
              className={`absolute left-0 z-50 w-60 rounded-xl border border-border bg-input-background shadow-lg overflow-hidden
                ${dropdownPosition === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5"}`}
            >
              {/* Search */}
              <div className="p-2 border-b border-border">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-placeholder pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-input bg-transparent text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow]"
                  />
                </div>
              </div>

              {/* List */}
              <ul className="max-h-60 overflow-y-auto py-1">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => {
                    const isSelected = selectedCountry.code === country.code;
                    return (
                      <li key={country.code}>
                        <button
                          type="button"
                          onClick={() => handleSelectCountry(country)}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-3 transition-colors hover:bg-border/40
                            ${isSelected ? "bg-border-active/10" : ""}`}
                        >
                          <span className="text-lg leading-none shrink-0">
                            {country.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-card-text truncate">
                              {country.name}
                            </p>
                            <p className="text-xs text-placeholder">
                              {country.dialCode}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-Green shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-3 py-4 text-sm text-placeholder text-center">
                    No countries found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── Phone number input ────────────────────────────────── */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder pointer-events-none" />
          <Input
            id={id}
            type="tel"
            placeholder={placeholder}
            className="pl-10 pr-4"
            disabled={disabled}
            {...register(id, {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9\s\-()]{6,14}$/,
                message: "Enter a valid phone number",
              },
            })}
          />
        </div>
      </div>

      {error && (
        // <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
        //   <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        //     <circle cx="10" cy="10" r="10" />
        //     <text x="50%" y="50%" textAnchor="middle" dy=".35em" fill="white" fontSize="11" fontWeight="bold">!</text>
        //   </svg>
        //   {error.message}
        // </p>
        <ErrorField message={error.message} />
      )}
    </div>
  );
}
