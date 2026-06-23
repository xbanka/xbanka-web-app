"use client";

export interface PersonalInfoTabProps {
  label: string;
  value: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PersonalInfoTab = ({
  label,
  value,
  subtitle,
  action,
}: PersonalInfoTabProps) => {
  return (
    <div className="space-y-1">
      {/* Label + action (Change / lock / badge) */}
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-text text-xs leading-5">{label}</p>
        {action}
      </div>

      {/* Value */}
      <h1 className="font-medium text-card-text text-sm leading-5">{value}</h1>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="font-normal text-text text-xs leading-4">{subtitle}</p>
      )}
    </div>
  );
};
