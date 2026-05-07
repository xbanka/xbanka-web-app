"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { ErrorField } from "./field-error";
import { Label } from "./label";
import { Input } from "./input";

import { SelectFieldProps } from "@/lib/types/form-types";

export const SearchSelectField = ({
  id,
  icon: Icon,
  placeholder,
  options,
  error,
  register,
  label,
}: SelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  // react-hook-form register
  const field = register ? register(id) : undefined;

  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-1">
      {label && <Label label={label} />}

      <div className="relative" ref={wrapperRef}>
        {/* Hidden input for react-hook-form */}
        <input
          type="hidden"
          value={selected}
          {...field}
        />

        <div
          onClick={() => setOpen((prev) => !prev)}
          className="relative flex items-center cursor-pointer"
        >
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder z-10" />
          )}

          <Input
            readOnly
            value={
              options.find((o) => o.value === selected)?.label || ""
            }
            placeholder={placeholder}
            className={`cursor-pointer ${
              Icon ? "pl-10 pr-10" : "pr-10"
            }`}
          />

          <span className="absolute right-3 text-placeholder pointer-events-none flex items-center">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-input bg-input-background shadow-md">
            <div className="p-2">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((o) => (
                  <div
                    key={o.value}
                    onClick={() => {
                      setSelected(o.value);
                      setSearch("");
                      setOpen(false);

                      field?.onChange({
                        target: {
                          name: id,
                          value: o.value,
                        },
                      });
                    }}
                    className="cursor-pointer px-4 py-2 text-[14px] hover:bg-muted"
                  >
                    {o.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-placeholder">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ErrorField message={error?.message} />
    </div>
  );
};