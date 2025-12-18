import { cn } from "@/lib/utils";
import { Brain, Target, RefreshCw, TrendingUp, Lightbulb } from "lucide-react";

export interface BehavioralAnalysisData {
  behavioral_interpretation: string;
  regret_archetype: {
    name: string;
    description: string;
    dominant_source: string;
  };
  counterfactual_analysis: string;
  micro_regret_forecast: string;
  systemic_insight: string;
}

interface BehavioralAnalysisProps {
  analysis: BehavioralAnalysisData | null;
  isLoading: boolean;
}

export function BehavioralAnalysis({ analysis, isLoading }: BehavioralAnalysisProps) {
  if (isLoading) {
    return (
      <div className="card-glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Behavioral Analysis</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2" />
              <div className="h-3 bg-muted/50 rounded w-full" />
              <div className="h-3 bg-muted/50 rounded w-3/4 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="card-glass rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Behavioral Analysis</h3>
      </div>

      {/* Archetype */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Archetype Detected</p>
            <p className="text-xl font-semibold text-gradient-regret">
              {analysis.regret_archetype.name}
            </p>
            <p className="text-sm text-foreground/70 mt-1">
              {analysis.regret_archetype.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Dominant source: <span className="text-primary">{analysis.regret_archetype.dominant_source}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Behavioral Interpretation */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Pattern Analysis</p>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {analysis.behavioral_interpretation}
        </p>
      </div>

      {/* Counterfactual Analysis */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Counterfactual Analysis</p>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed pl-6">
          {analysis.counterfactual_analysis}
        </p>
      </div>

      {/* Micro Regret Forecast */}
      <div className="border-l-2 border-primary/30 pl-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-wider text-primary">Micro-Forecast</p>
        </div>
        <p className="text-sm text-foreground/90 italic">
          "{analysis.micro_regret_forecast}"
        </p>
      </div>

      {/* Systemic Insight */}
      <div className="bg-card/50 rounded-lg p-4 border border-border/30">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-accent mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Systemic Insight</p>
            <p className="text-sm text-foreground/80">
              {analysis.systemic_insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
