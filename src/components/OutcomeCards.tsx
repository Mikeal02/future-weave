import { cn } from "@/lib/utils";
import type { Outcomes, OutcomeScore } from "@/lib/simulator";
import { DollarSign, Users, Heart, Brain } from "lucide-react";

interface OutcomeCardsProps {
  outcomes: Outcomes;
}

const outcomeConfigs = [
  { key: 'financial' as const, label: 'Financial', icon: DollarSign },
  { key: 'social' as const, label: 'Social', icon: Users },
  { key: 'health' as const, label: 'Health', icon: Heart },
  { key: 'mentalStability' as const, label: 'Mental Stability', icon: Brain },
];

function getSeverityStyles(severity: OutcomeScore['severity']) {
  switch (severity) {
    case 'critical':
      return { bg: 'bg-critical/10', border: 'border-critical/30', text: 'text-critical', label: 'Critical' };
    case 'unstable':
      return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', label: 'Unstable' };
    case 'balanced':
      return { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent', label: 'Balanced' };
    case 'strong':
      return { bg: 'bg-cyan/10', border: 'border-cyan/30', text: 'text-cyan', label: 'Strong' };
    case 'elite':
      return { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', label: 'Elite' };
  }
}

export function OutcomeCards({ outcomes }: OutcomeCardsProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">Life Outcomes</h3>
        <p className="text-sm text-muted-foreground">Projected status across key domains</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {outcomeConfigs.map((config) => {
          const Icon = config.icon;
          const outcome = outcomes[config.key];
          const styles = getSeverityStyles(outcome.severity);
          
          return (
            <div 
              key={config.key}
              className={cn(
                "rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02]",
                styles.bg, styles.border
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", styles.bg)}>
                  <Icon className={cn("w-4 h-4", styles.text)} />
                </div>
                <span className="text-sm font-medium text-foreground">{config.label}</span>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <span className={cn("text-3xl font-bold font-mono", styles.text)}>
                    {outcome.score}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                
                <span className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  styles.bg, styles.text
                )}>
                  {styles.label}
                </span>
              </div>
              
              {/* Mini progress bar */}
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000", 
                    outcome.severity === 'critical' && "bg-critical",
                    outcome.severity === 'unstable' && "bg-warning",
                    outcome.severity === 'balanced' && "bg-accent",
                    outcome.severity === 'strong' && "bg-cyan",
                    outcome.severity === 'elite' && "bg-success",
                  )}
                  style={{ width: `${outcome.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
