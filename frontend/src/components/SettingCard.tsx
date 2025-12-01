import React from "react";

interface SettingCardProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

export default function SettingCard({
  children,
  className = "",
  isDark = false,
}: SettingCardProps) {
  return (
    <div
      className={`rounded-3xl shadow-lg px-8 py-10 w-full max-w-[480px] flex flex-col gap-6 ${
        isDark ? "bg-[#222] shadow-black/20" : "bg-white shadow-black/5"
      } ${className}`}
    >
      {children}
    </div>
  );
}
