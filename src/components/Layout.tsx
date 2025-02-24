
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-wellness-50">
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-3xl font-bold text-wellness-700 fade-in">
            Wellness Tracker
          </h1>
        </div>
        {children}
      </main>
    </div>
  );
}
