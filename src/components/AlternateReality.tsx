import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import type { DecisionSliders, Outcomes, RegretData } from "@/lib/simulator";
import { calculateOutcomes, calculateRegret } from "@/lib/simulator";
import type { LifePath } from "@/lib/simulator";
import { GitBranch, ArrowRight } from "lucide-react";

interface AlternateRealityProps {
  originalSliders: DecisionSliders;
  originalOutcomes: Outcomes;
  originalRegret: RegretData;
  lifePath: LifePath;
}

const sliderLabels: Record<keyof DecisionSliders, string> = {
  careerFocus: 'Career Focus',
  moneyDiscipline: 'Money Discipline',
  healthFitness: 'Health & Fitness',
  relationships: 'Relationships',
  learningGrowth: 'Learning & Growth',
  riskTaking: 'Risk Taking',
};

export function AlternateReality({ originalSliders, originalOutcomes, originalRegret, lifePath }: AlternateRealityProps) {
  const [selectedKey, setSelectedKey] = useState<keyof DecisionSliders>('careerFocus');
  const [altValue, setAltValue] = useState(originalSliders[selectedKey]);

  const altSliders = { ...originalSliders, [selectedKey]: altValue };
  const altOutcomes = calculateOutcomes(lifePath, altSliders);
  const altRegret = calculateRegret(lifePath, altSliders, altOutcomes);

  const regretDiff = altRegret.score - originalRegret.score;
  const avgOriginal = (originalOutcomes.financial.score + originalOutcomes.social.score + originalOutcomes.health.score + originalOutcomes.mentalStability.score) / 4;
  const avgAlt = (altOutcomes.financial.score + altOutcomes.social.score + altOutcomes.health.score + altOutcomes.mentalStability.score) / 4;
  const outcomeDiff = avgAlt - avgOriginal;

  return (
    <div className="card-glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan/20 flex items-center justify-center">
          <GitBranch className="w-5 h-5 text-cyan" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Alternate Reality</h3>
          <p className="text-sm text-muted-foreground">What if you changed one decision?</p>
        </div>
      </div>

      {/* Slider Selection */}
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground">Select a decision to modify:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(Object.keys(sliderLabels) as Array<keyof DecisionSliders>).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedKey(key);
                setAltValue(originalSliders[key]);
              }}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                selectedKey === key 
                  ? "bg-cyan/20 text-cyan border border-cyan/30" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {sliderLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Alt Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground">{sliderLabels[selectedKey]}</span>
          <span className="font-mono text-cyan">{altValue}</span>
        </div>
        <Slider
          value={[altValue]}
          onValueChange={(v) => setAltValue(v[0])}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Original: {originalSliders[selectedKey]}</span>
          <span>Change: {altValue - originalSliders[selectedKey] > 0 ? '+' : ''}{altValue - originalSliders[selectedKey]}</span>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Original Timeline</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-foreground">Regret</span>
              <span className="font-mono text-primary">{originalRegret.score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground">Avg Outcome</span>
              <span className="font-mono text-foreground">{Math.round(avgOriginal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-cyan/10 border border-cyan/20 rounded-xl p-4">
          <p className="text-xs text-cyan uppercase tracking-wider mb-2">Alternate Timeline</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-foreground">Regret</span>
              <span className={cn(
                "font-mono",
                regretDiff < 0 ? "text-success" : regretDiff > 0 ? "text-critical" : "text-foreground"
              )}>
                {altRegret.score}
                {regretDiff !== 0 && (
                  <span className="text-xs ml-1">({regretDiff > 0 ? '+' : ''}{regretDiff})</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground">Avg Outcome</span>
              <span className={cn(
                "font-mono",
                outcomeDiff > 0 ? "text-success" : outcomeDiff < 0 ? "text-critical" : "text-foreground"
              )}>
                {Math.round(avgAlt)}
                {outcomeDiff !== 0 && (
                  <span className="text-xs ml-1">({outcomeDiff > 0 ? '+' : ''}{Math.round(outcomeDiff)})</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={cn(
        "p-4 rounded-xl flex items-center gap-3",
        regretDiff < -10 ? "bg-success/10 border border-success/30" : 
        regretDiff > 10 ? "bg-critical/10 border border-critical/30" : 
        "bg-muted/30 border border-border/30"
      )}>
        <ArrowRight className={cn(
          "w-5 h-5",
          regretDiff < -10 ? "text-success" : regretDiff > 10 ? "text-critical" : "text-muted-foreground"
        )} />
        <p className="text-sm text-foreground">
          {regretDiff < -10 
            ? "This change significantly improves your trajectory." 
            : regretDiff > 10 
            ? "This change worsens your projected outcomes."
            : "This change has minimal impact on your future."}
        </p>
      </div>
    </div>
  );
}
