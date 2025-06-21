'use client';

import { DashboardNavbar } from './dashboard-navbar';
import { AnimatedBackground } from '@/components/custom/animated-background';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <AnimatedBackground />
      
      {/* Navbar */}
      <DashboardNavbar />
      
      {/* Main Content Area with proper top padding for fixed navbar */}
      <main className="relative z-10 pt-24 flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8 w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
