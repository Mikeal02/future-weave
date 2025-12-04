import { cn } from "@/lib/utils";
import type { PointOfNoReturn } from "@/lib/simulator";
import { AlertTriangle, Clock } from "lucide-react";

interface TimelineProps {
  activeYear: 0 | 5 | 10 | 30;
  onYearChange: (year: 0 | 5 | 10 | 30) => void;
  pointOfNoReturn: PointOfNoReturn | null;
}

const timePoints = [
  { year: 0 as const, label: 'Now' },
  { year: 5 as const, label: '5 Years' },
  { year: 10 as const, label: '10 Years' },
  { year: 30 as const, label: '30 Years' },
];

export function Timeline({ activeYear, onYearChange, pointOfNoReturn }: TimelineProps) {
  const ponrYear = pointOfNoReturn?.year ?? 999;
  
  return (
    <div className="relative py-8">
      {/* Timeline line */}
      <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted rounded-full -translate-y-1/2" />
      
      {/* Progress line */}
      <div 
        className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-primary to-accent rounded-full -translate-y-1/2 transition-all duration-500"
        style={{ 
          width: `${activeYear === 0 ? 0 : activeYear === 5 ? 33 : activeYear === 10 ? 66 : 100}%` 
        }}
      />
      
      {/* Point of No Return marker */}
      {pointOfNoReturn && (
        <div 
          className="absolute top-1/2 -translate-y-1/2 z-20"
          style={{ 
            left: `${ponrYear <= 5 ? 33 : ponrYear <= 10 ? 66 : ponrYear <= 15 ? 75 : 85}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative group">
            <div className="w-8 h-8 rounded-full bg-critical flex items-center justify-center animate-pulse-glow cursor-pointer">
              <AlertTriangle className="w-4 h-4 text-critical-foreground" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-card border border-critical/50 rounded-lg p-3 shadow-xl min-w-[200px]">
                <p className="text-xs font-semibold text-critical mb-1">Point of No Return</p>
                <p className="text-xs text-muted-foreground">Year {pointOfNoReturn.year}</p>
                <p className="text-xs text-foreground mt-2">{pointOfNoReturn.warning}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Time points */}
      <div className="relative flex justify-between">
        {timePoints.map((point, index) => {
          const isActive = activeYear === point.year;
          const isPassed = activeYear > point.year;
          const isPonr = pointOfNoReturn && point.year >= ponrYear;
          
          return (
            <button
              key={point.year}
              onClick={() => onYearChange(point.year)}
              className={cn(
                "flex flex-col items-center gap-2 transition-all duration-300",
                "hover:scale-110 active:scale-95"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                isActive && "bg-primary border-primary scale-110 glow-regret",
                isPassed && !isActive && "bg-primary/50 border-primary/50",
                !isActive && !isPassed && "bg-card border-border hover:border-primary/50",
                isPonr && !isActive && "border-critical/50"
              )}>
                <Clock className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )} />
              </div>
              
              <span className={cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {point.label}
              </span>
              
              {point.year === 30 && (
                <span className="text-xs text-muted-foreground">Final Reflection</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
