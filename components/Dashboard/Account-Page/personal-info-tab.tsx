"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";

export interface PersonalInfoTabProps {
  label: string;
  value: string;
  onSave?: (value: string) => Promise<void> | void;
  renderInput?: (
    value: string,
    onChange: (val: string) => void,
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
        <p className="font-medium text-text text-xs leading-5">{label}</p>
      </div>

      {/* Content */}

      <h1 className="font-medium text-card-text text-xs leading-5">{value}</h1>
    </div>
  );
};
