import { cn } from "@/lib/utils";
import type { LifePath } from "@/lib/simulator";
import { Shield, Flame, Shuffle, Target, Moon, Zap } from "lucide-react";

interface LifePathSelectorProps {
  selected: LifePath | null;
  onSelect: (path: LifePath) => void;
}

const paths: { id: LifePath; name: string; description: string; icon: React.ElementType }[] = [
  { id: 'safe', name: 'Safe', description: 'Minimize risk, maximize security', icon: Shield },
  { id: 'risky', name: 'Risky', description: 'High stakes, high potential', icon: Flame },
  { id: 'chaotic', name: 'Chaotic', description: 'Embrace unpredictability', icon: Shuffle },
  { id: 'disciplined', name: 'Disciplined', description: 'Structure and consistency', icon: Target },
  { id: 'lazy', name: 'Lazy', description: 'Path of least resistance', icon: Moon },
  { id: 'obsessive', name: 'Obsessive', description: 'All-consuming dedication', icon: Zap },
];

export function LifePathSelector({ selected, onSelect }: LifePathSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Choose Your Life Path</h2>
        <p className="text-muted-foreground text-sm">Select the trajectory that defines your approach to life</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {paths.map((path) => {
          const Icon = path.icon;
          const isSelected = selected === path.id;
          
          return (
            <button
              key={path.id}
              onClick={() => onSelect(path.id)}
              className={cn(
                "group relative p-4 rounded-xl border transition-all duration-300",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected 
                  ? "bg-primary/10 border-primary glow-regret" 
                  : "bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              
              <h3 className={cn(
                "font-semibold text-sm mb-1 transition-colors",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {path.name}
              </h3>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {path.description}
              </p>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
