import { ReactNode } from "react";

export interface cardProps {
    children: ReactNode;
    className?: string
}
export interface OnboardingCardProps {
    status: "done" | "active" | "pending";
    className?: string;
    step: string;
    title: string;
    desc?: string;
    label?: string;
}
export interface AccountCardProps {
    tier: string;
    label: string;
    description: string;
    time: string;
    className?: string
}