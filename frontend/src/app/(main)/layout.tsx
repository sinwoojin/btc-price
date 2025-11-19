// src/app/(main)/layout.tsx

import ThemeAwareContainer from "@/components/ThemeAwareContainer";
import { Analytics } from "@vercel/analytics/next";
import type React from "react";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeAwareContainer>
      <Suspense fallback={null}>{children}</Suspense>
      <Analytics />
    </ThemeAwareContainer>
  );
}
