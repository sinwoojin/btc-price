// src/app/(main)/layout.tsx

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-grow container mx-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
