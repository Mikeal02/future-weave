import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareableCardProps {
  lifePath: string;
  regretScore: number;
  archetype: string;
  regretSentence: string;
}

export function ShareableCard({ lifePath, regretScore, archetype, regretSentence }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const shareText = `🔮 Future Regret Simulation\n\n${archetype}\n📊 ${regretScore}% Regret Score\n\n"${regretSentence}"\n\n🎯 ${lifePath.charAt(0).toUpperCase() + lifePath.slice(1)} Path\n\nSimulate your future: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Future Regret Simulation',
          text: shareText,
        });
        toast.success('Shared successfully!');
      } catch (err: any) {
        // User cancelled or share failed - try clipboard fallback
        if (err.name !== 'AbortError') {
          await copyToClipboard(shareText);
        }
      }
    } else {
      await copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Shareable Regret Card</h3>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Card Preview */}
      <div 
        ref={cardRef}
        className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-background via-card to-primary/20 border border-primary/30 p-6 flex flex-col justify-between"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">Future Regret Simulator</p>
          <h4 className="text-2xl font-display font-bold text-gradient-regret">{archetype}</h4>
        </div>

        <div className="relative z-10 text-center py-8">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-6xl font-bold font-mono text-primary">{regretScore}</span>
            <span className="text-2xl text-muted-foreground">%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Regret Score</p>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30 capitalize">
              {lifePath} Path
            </span>
          </div>
          <p className="text-sm text-foreground/80 italic leading-relaxed">
            "{regretSentence}"
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-primary/10 blur-xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-accent/10 blur-xl" />
      </div>
    </div>
  );
}
