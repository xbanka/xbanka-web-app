"use client";

type Props = {
  value?: string;
  onChange: (date: string) => void;
};

export const DatePicker = ({ value, onChange }: Props) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-input text-card-text text-xs outline-none"
    />
  );
};