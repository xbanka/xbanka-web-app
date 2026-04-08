import { ReactNode } from "react";

export interface cardProps {
    children: ReactNode;
    className?: string
}
export interface AccountCardProps {
    tier: string;
    label: string;
    description: string;
    time: string;
    className?: string
}