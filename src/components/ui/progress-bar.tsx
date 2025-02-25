
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  className?: string;
}

export const ProgressBar = ({ value, max, label, className }: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-wellness-700">{label}</span>
        <span className="text-wellness-600">{value}g</span>
      </div>
      <div className={cn("h-2 w-full bg-wellness-100 rounded-full", className)}>
        <div
          className="h-full bg-wellness-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
