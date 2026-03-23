import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-white min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-[393px] px-6 py-6">
        {children}
      </div>
    </div>
  );
}