"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";

export interface PersonalInfoTabProps {
  label: string;
  value: string;
  onSave?: (value: string) => Promise<void> | void;
  renderInput?: (
    value: string,
    onChange: (val: string) => void
  ) => React.ReactNode;
}

export const PersonalInfoTab = ({
  label,
  value,
  onSave,
  renderInput,
}: PersonalInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleSave = async () => {
    await onSave?.(localValue);
    setIsEditing(false);
  };

  return (
    <div className="space-y-1">
      {/* Label + Change */}
      <div className="flex items-center justify-between">
        <p className="font-medium text-text text-xs leading-5">
          {label}
        </p>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-[10px] text-Green hover:underline"
          >
            <Edit2 className="w-3 h-3" />
            Change
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="text-[10px] text-Green font-semibold"
          >
            Save
          </button>
        )}
      </div>

      {/* Content */}
      {!isEditing ? (
        <h1 className="font-medium text-card-text text-xs leading-5">
          {value || "-"}
        </h1>
      ) : renderInput ? (
        renderInput(localValue, setLocalValue)
      ) : (
        <input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full bg-transparent border-b border-input text-card-text text-xs outline-none"
        />
      )}
    </div>
  );
};