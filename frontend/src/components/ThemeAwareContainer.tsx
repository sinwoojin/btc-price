// src/components/ThemeAwareContainer.tsx
"use client";

import { useTheme } from "@/lib/utils/theme-context";

export default function ThemeAwareContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div
      className={
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }
    >
      {children}
    </div>
  );
}
