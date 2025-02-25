
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-white to-wellness-50">
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-3xl font-bold text-wellness-700 hover:scale-105 transition-transform duration-300">
            Wellness Tracker
          </h1>
          <img 
            src="/lovable-uploads/30e58238-8170-4e29-9dcd-bae416a0ff42.png" 
            alt="Wellness Logo" 
            className="h-12 ml-4 hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
