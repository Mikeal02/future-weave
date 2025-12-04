import { Slider } from "@/components/ui/slider";
import type { DecisionSliders as DecisionSlidersType } from "@/lib/simulator";
import { Briefcase, Wallet, Heart, Users, BookOpen, Dice6 } from "lucide-react";

interface DecisionSlidersProps {
  values: DecisionSlidersType;
  onChange: (values: DecisionSlidersType) => void;
}

const sliderConfigs = [
  { key: 'careerFocus' as const, label: 'Career Focus', icon: Briefcase, lowLabel: 'Neglected', highLabel: 'Obsessed' },
  { key: 'moneyDiscipline' as const, label: 'Money Discipline', icon: Wallet, lowLabel: 'Reckless', highLabel: 'Frugal' },
  { key: 'healthFitness' as const, label: 'Health & Fitness', icon: Heart, lowLabel: 'Ignored', highLabel: 'Prioritized' },
  { key: 'relationships' as const, label: 'Relationships', icon: Users, lowLabel: 'Isolated', highLabel: 'Connected' },
  { key: 'learningGrowth' as const, label: 'Learning & Growth', icon: BookOpen, lowLabel: 'Stagnant', highLabel: 'Evolving' },
  { key: 'riskTaking' as const, label: 'Risk Taking', icon: Dice6, lowLabel: 'Cautious', highLabel: 'Bold' },
];

export function DecisionSliders({ values, onChange }: DecisionSlidersProps) {
  const handleChange = (key: keyof DecisionSlidersType, value: number[]) => {
    onChange({ ...values, [key]: value[0] });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Calibrate Your Decisions</h2>
        <p className="text-muted-foreground text-sm">Adjust each dimension to reflect your life choices</p>
      </div>
      
      <div className="space-y-5">
        {sliderConfigs.map((config) => {
          const Icon = config.icon;
          const value = values[config.key];
          
          return (
            <div key={config.key} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{config.label}</span>
                </div>
                <span className="text-sm font-mono text-primary font-bold">{value}</span>
              </div>
              
              <div className="px-1">
                <Slider
                  value={[value]}
                  onValueChange={(v) => handleChange(config.key, v)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between mt-1 px-1">
                <span className="text-xs text-muted-foreground">{config.lowLabel}</span>
                <span className="text-xs text-muted-foreground">{config.highLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
