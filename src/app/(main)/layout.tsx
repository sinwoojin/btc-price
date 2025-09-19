// src/app/(main)/layout.tsx

import BottomNav from "@/components/common/Bottom";
import Footer from "@/components/common/Footer";

import ThemeProvider from "@/lib/utils/theme-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <main className="flex-grow container mx-auto p-4 md:p-8">
          {children}
        </main>
        <BottomNav />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
