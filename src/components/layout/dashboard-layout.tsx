'use client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8 w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}