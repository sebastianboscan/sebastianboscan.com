import type { ReactNode } from "react";

type TacticalCardProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly accent?: "blue" | "yellow" | "none";
};

const accentClassNames = {
  blue: "border-[#1e1e1e] hover:border-blue-500/30",
  yellow: "border-yellow-500/30 hover:border-yellow-400/40",
  none: "border-[#1e1e1e]",
} as const;

export function TacticalCard({
  children,
  className = "",
  accent = "blue",
}: TacticalCardProps) {
  return (
    <div className={`border bg-[#111] transition-all ${accentClassNames[accent]} ${className}`.trim()}>
      {children}
    </div>
  );
}
