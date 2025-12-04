import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface NarrativePanelProps {
  title: string;
  narrative: string;
  isLoading: boolean;
  variant?: 'default' | 'reflection';
}

export function NarrativePanel({ title, narrative, isLoading, variant = 'default' }: NarrativePanelProps) {
  return (
    <div className={cn(
      "rounded-2xl p-6 transition-all duration-500",
      variant === 'reflection' 
        ? "bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/20" 
        : "card-glass"
    )}>
      <h3 className={cn(
        "text-lg font-semibold mb-4",
        variant === 'reflection' ? "text-gradient-regret" : "text-foreground"
      )}>
        {title}
      </h3>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Simulating your future...</p>
        </div>
      ) : (
        <div className="prose prose-invert prose-sm max-w-none">
          <p className={cn(
            "text-foreground/90 leading-relaxed whitespace-pre-wrap",
            variant === 'reflection' && "italic"
          )}>
            {narrative || "Run the simulation to see your projected future..."}
          </p>
        </div>
      )}
    </div>
  );
}
