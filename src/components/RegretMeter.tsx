import { cn } from "@/lib/utils";
import type { RegretData } from "@/lib/simulator";

interface RegretMeterProps {
  regret: RegretData;
}

export function RegretMeter({ regret }: RegretMeterProps) {
  const getIntensityColor = () => {
    switch (regret.intensity) {
      case 'low': return 'from-success to-cyan';
      case 'medium': return 'from-accent to-warning';
      case 'heavy': return 'from-warning to-critical';
      case 'existential': return 'from-critical to-destructive';
    }
  };

  const getIntensityLabel = () => {
    switch (regret.intensity) {
      case 'low': return 'Manageable';
      case 'medium': return 'Noticeable';
      case 'heavy': return 'Burdensome';
      case 'existential': return 'Overwhelming';
    }
  };

  return (
    <div className="card-glass rounded-2xl p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">Regret Score</h3>
        <p className="text-sm text-muted-foreground">Cumulative life dissatisfaction index</p>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center justify-center">
        <div className={cn(
          "relative w-32 h-32 rounded-full flex items-center justify-center",
          regret.intensity === 'existential' && "animate-glow"
        )}>
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="url(#regretGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${regret.score * 3.64} 364`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="regretGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="text-center z-10">
            <span className="text-4xl font-bold font-mono text-gradient-regret">{regret.score}</span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      {/* Intensity Meter */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Intensity Level</span>
          <span className={cn(
            "font-semibold",
            regret.intensity === 'low' && "text-success",
            regret.intensity === 'medium' && "text-accent",
            regret.intensity === 'heavy' && "text-warning",
            regret.intensity === 'existential' && "text-critical"
          )}>
            {getIntensityLabel()}
          </span>
        </div>
        
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", getIntensityColor())}
            style={{ width: `${regret.score}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>Heavy</span>
          <span>Existential</span>
        </div>
      </div>

      {/* Primary Cause */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Primary Cause</p>
          <p className="text-foreground font-semibold">{regret.primaryCause}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Key Contributing Factors</p>
          <div className="flex flex-wrap gap-2">
            {regret.topDecisions.map((decision, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
              >
                {decision}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
