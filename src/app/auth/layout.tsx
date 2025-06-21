import { LandingNavbar } from '@/components/layout/landing-navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">
      <LandingNavbar />
      {children}
    </div>
  );
}
