import { AlertCircle } from "lucide-react";

interface DailyMicroRegretProps {
  message: string;
}

export function DailyMicroRegret({ message }: DailyMicroRegretProps) {
  return (
    <div className="bg-gradient-to-r from-warning/10 to-critical/10 border border-warning/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-warning" />
        </div>
        
        <div>
          <p className="text-xs font-semibold text-warning uppercase tracking-wider mb-1">
            Daily Micro-Regret Prediction
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
