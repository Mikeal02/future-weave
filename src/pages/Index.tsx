import { useState, useCallback } from "react";
import { LifePathSelector } from "@/components/LifePathSelector";
import { DecisionSliders } from "@/components/DecisionSliders";
import { RegretMeter } from "@/components/RegretMeter";
import { OutcomeCards } from "@/components/OutcomeCards";
import { Timeline } from "@/components/Timeline";
import { NarrativePanel } from "@/components/NarrativePanel";
import { DailyMicroRegret } from "@/components/DailyMicroRegret";
import { AlternateReality } from "@/components/AlternateReality";
import { ShareableCard } from "@/components/ShareableCard";
import { Button } from "@/components/ui/button";
import { 
  calculateOutcomes, 
  calculateRegret, 
  calculatePointOfNoReturn,
  generateArchetype,
  generateDailyMicroRegret,
  generateShareableRegret,
  type LifePath,
  type DecisionSliders as DecisionSlidersType,
  type SimulationResult
} from "@/lib/simulator";
import { Play, RotateCcw, Sparkles } from "lucide-react";

const defaultSliders: DecisionSlidersType = {
  careerFocus: 50,
  moneyDiscipline: 50,
  healthFitness: 50,
  relationships: 50,
  learningGrowth: 50,
  riskTaking: 50,
};

export default function Index() {
  const [lifePath, setLifePath] = useState<LifePath | null>(null);
  const [sliders, setSliders] = useState<DecisionSlidersType>(defaultSliders);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [activeYear, setActiveYear] = useState<0 | 5 | 10 | 30>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [narratives, setNarratives] = useState({
    year5: '',
    year10: '',
    year30: '',
    finalReflection: '',
  });

  const runSimulation = useCallback(async () => {
    if (!lifePath) return;
    
    setIsSimulating(true);
    setActiveYear(0);
    
    // Calculate outcomes
    const outcomes = calculateOutcomes(lifePath, sliders);
    const regret = calculateRegret(lifePath, sliders, outcomes);
    const pointOfNoReturn = calculatePointOfNoReturn(lifePath, sliders, outcomes);
    const archetype = generateArchetype(lifePath, outcomes, regret);
    const dailyMicroRegret = generateDailyMicroRegret(lifePath, sliders);
    
    // Generate narratives (simulated - in production this would call AI)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedNarratives = generateLocalNarratives(lifePath, sliders, outcomes, regret, archetype);
    
    setNarratives(generatedNarratives);
    
    setResult({
      outcomes,
      regret,
      pointOfNoReturn,
      narratives: {
        year5: generatedNarratives.year5,
        year10: generatedNarratives.year10,
        year30: generatedNarratives.year30,
      },
      dailyMicroRegret,
      finalReflection: generatedNarratives.finalReflection,
      archetype,
    });
    
    setIsSimulating(false);
    setActiveYear(5);
  }, [lifePath, sliders]);

  const resetSimulation = () => {
    setLifePath(null);
    setSliders(defaultSliders);
    setResult(null);
    setActiveYear(0);
    setNarratives({ year5: '', year10: '', year30: '', finalReflection: '' });
  };

  const canSimulate = lifePath !== null;

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Hero Header */}
      <header className="relative border-b border-border/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container py-12 md:py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Behavioral Simulation Engine</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              <span className="text-foreground">Future</span>{' '}
              <span className="text-gradient-regret">Regret</span>{' '}
              <span className="text-foreground">Simulator</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Explore the long-term consequences of your life decisions. 
              See your potential future through behavioral logic and probability scoring.
            </p>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        {!result ? (
          /* Input Phase */
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Life Path Selection */}
            <section className="card-glass rounded-2xl p-6 md:p-8 animate-fade-in">
              <LifePathSelector selected={lifePath} onSelect={setLifePath} />
            </section>

            {/* Decision Sliders */}
            <section className="card-glass rounded-2xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <DecisionSliders values={sliders} onChange={setSliders} />
            </section>

            {/* Run Simulation Button */}
            <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button 
                variant="accent"
                size="xl" 
                onClick={runSimulation}
                disabled={!canSimulate || isSimulating}
                className="min-w-[250px]"
              >
                {isSimulating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Simulating Future...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Simulate My Future
                  </>
                )}
              </Button>
            </div>

            {!canSimulate && (
              <p className="text-center text-muted-foreground text-sm animate-pulse">
                Select a life path to begin the simulation
              </p>
            )}
          </div>
        ) : (
          /* Results Phase */
          <div className="space-y-8">
            {/* Timeline */}
            <section className="max-w-4xl mx-auto card-glass rounded-2xl p-6 animate-fade-in">
              <Timeline 
                activeYear={activeYear} 
                onYearChange={setActiveYear}
                pointOfNoReturn={result.pointOfNoReturn}
              />
            </section>

            {/* Daily Micro Regret */}
            <section className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <DailyMicroRegret message={result.dailyMicroRegret} />
            </section>

            {/* Main Results Grid */}
            <div className="grid lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Left Column - Outcomes & Regret */}
              <div className="space-y-6">
                <RegretMeter regret={result.regret} />
                <OutcomeCards outcomes={result.outcomes} />
              </div>

              {/* Center Column - Narratives */}
              <div className="lg:col-span-2 space-y-6">
                {activeYear === 5 && (
                  <NarrativePanel 
                    title="5-Year Projection" 
                    narrative={narratives.year5}
                    isLoading={isSimulating}
                  />
                )}
                {activeYear === 10 && (
                  <NarrativePanel 
                    title="10-Year Projection" 
                    narrative={narratives.year10}
                    isLoading={isSimulating}
                  />
                )}
                {activeYear === 30 && (
                  <>
                    <NarrativePanel 
                      title="30-Year Final Outlook" 
                      narrative={narratives.year30}
                      isLoading={isSimulating}
                    />
                    <NarrativePanel 
                      title="You at 60: Looking Back" 
                      narrative={narratives.finalReflection}
                      isLoading={isSimulating}
                      variant="reflection"
                    />
                  </>
                )}

                {/* Alternate Reality */}
                <AlternateReality 
                  originalSliders={sliders}
                  originalOutcomes={result.outcomes}
                  originalRegret={result.regret}
                  lifePath={lifePath!}
                />

                {/* Shareable Card */}
                <div className="card-glass rounded-2xl p-6">
                  <ShareableCard 
                    lifePath={lifePath!}
                    regretScore={result.regret.score}
                    archetype={result.archetype}
                    regretSentence={generateShareableRegret(result.archetype, result.regret.score, result.regret.primaryCause)}
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center pt-8">
              <Button variant="outline" size="lg" onClick={resetSimulation} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Start New Simulation
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 mt-12">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            This is a probability-based behavioral simulator, not a prediction of actual future events.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Built for psychological exploration and decision awareness.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Local narrative generation (in production, this would call an AI API)
function generateLocalNarratives(
  lifePath: LifePath,
  sliders: DecisionSlidersType,
  outcomes: { financial: { score: number }; social: { score: number }; health: { score: number }; mentalStability: { score: number } },
  regret: { score: number; primaryCause: string },
  archetype: string
) {
  const avgOutcome = (outcomes.financial.score + outcomes.social.score + outcomes.health.score + outcomes.mentalStability.score) / 4;
  
  const pathDescriptions: Record<LifePath, string> = {
    safe: 'comfort-seeking',
    risky: 'high-stakes',
    chaotic: 'unpredictable',
    disciplined: 'structured',
    lazy: 'path-of-least-resistance',
    obsessive: 'all-consuming',
  };

  const year5 = avgOutcome >= 60
    ? `Five years into your ${pathDescriptions[lifePath]} journey, the early signs are cautiously optimistic. Your financial situation shows ${outcomes.financial.score >= 60 ? 'steady growth' : 'some strain'}, while relationships ${outcomes.social.score >= 60 ? 'remain a source of strength' : 'require more attention than you anticipated'}. The choices you have made are beginning to compound. ${sliders.careerFocus >= 60 ? 'Career momentum is building' : 'Career stagnation is becoming noticeable'}. Health-wise, ${outcomes.health.score >= 60 ? 'your body still forgives your choices' : 'warning signs are emerging'}. The ${archetype} pattern is taking shape.`
    : `Five years down the ${pathDescriptions[lifePath]} path, cracks are forming. Financial stress ${outcomes.financial.score < 40 ? 'keeps you up at night' : 'is a constant background hum'}. Relationships ${outcomes.social.score < 40 ? 'have deteriorated significantly' : 'feel strained'}. Your ${regret.primaryCause.toLowerCase()} is already casting shadows. The body ${outcomes.health.score < 40 ? 'is sending urgent signals you keep ignoring' : 'shows early signs of neglect'}. The ${archetype} archetype is crystallizing.`;

  const year10 = avgOutcome >= 60
    ? `A decade in, the ${pathDescriptions[lifePath]} approach has yielded ${outcomes.financial.score >= 70 ? 'substantial returns' : 'modest gains'}. Your network ${outcomes.social.score >= 70 ? 'has become a genuine source of support' : 'exists but lacks depth'}. Mental clarity ${outcomes.mentalStability.score >= 70 ? 'remains sharp, though wisdom comes with harder questions' : 'wavers between confidence and doubt'}. The ${regret.primaryCause.toLowerCase()} still lingers in quiet moments. You recognize yourself as ${archetype}, and you are learning to accept what that means.`
    : `Ten years of ${pathDescriptions[lifePath]} choices have accumulated into something you barely recognize. Financial recovery ${outcomes.financial.score < 50 ? 'seems increasingly distant' : 'is possible but requires dramatic change'}. Social connections ${outcomes.social.score < 50 ? 'have thinned to near-nothing' : 'exist in a shallow, transactional state'}. The ${regret.primaryCause.toLowerCase()} has metastasized into daily anxiety. Health ${outcomes.health.score < 50 ? 'is now a serious concern that can no longer be ignored' : 'requires immediate attention'}. The ${archetype} identity feels less like a choice and more like a cage.`;

  const year30 = avgOutcome >= 60
    ? `Three decades have transformed the ${pathDescriptions[lifePath]} choice into a full life story. Financial security ${outcomes.financial.score >= 70 ? 'allows for genuine freedom' : 'is adequate but not abundant'}. Relationships ${outcomes.social.score >= 70 ? 'have deepened into something irreplaceable' : 'provide companionship if not profound connection'}. Health ${outcomes.health.score >= 70 ? 'has been maintained through consistent effort' : 'requires careful management'}. As ${archetype}, you have made peace with the roads not taken. Regret sits at ${regret.score}% - present, but not defining. The ${regret.primaryCause.toLowerCase()} remains your biggest what-if, but you have learned that every path has its ghosts.`
    : `Thirty years of ${pathDescriptions[lifePath]} living have written a story you struggle to recognize as your own. Financial reality ${outcomes.financial.score < 50 ? 'has hardened into permanent limitation' : 'is a constant source of stress'}. Loneliness ${outcomes.social.score < 50 ? 'has become the background noise of existence' : 'visits more often than you would like'}. Physical decline ${outcomes.health.score < 50 ? 'accelerates, a daily reminder of accumulated neglect' : 'is setting in faster than expected'}. The ${archetype} label feels like a verdict. At ${regret.score}% regret, every quiet moment brings the same thought: the ${regret.primaryCause.toLowerCase()} changed everything, and you saw it happening, and you let it happen anyway.`;

  const finalReflection = avgOutcome >= 60
    ? `I am sitting here at 60, looking at old photographs, trying to find the moment when I became who I am. The ${pathDescriptions[lifePath]} choice seemed so natural back then - was it courage or just momentum? I think about ${regret.primaryCause.toLowerCase()} sometimes. Not with pain anymore, just wonder. What would that other life have looked like? But then I look at what I have: ${outcomes.financial.score >= 60 ? 'the security I built' : 'enough to get by'}, ${outcomes.social.score >= 60 ? 'the faces that light up when I walk in' : 'a few people who still check in'}, ${outcomes.health.score >= 60 ? 'a body that still cooperates most days' : 'health that requires attention'}. The ${archetype} in me made this. I made this. And on the good days, I can almost believe it was worth it.`
    : `Sixty years old. The ${pathDescriptions[lifePath]} life has run its course. I try not to think about the ${regret.primaryCause.toLowerCase()} - that door closed so long ago - but it is there in every silence, every empty room. I used to think I had time. Time to fix things. Time to try again. Time to become someone different. But time does not wait, and regret does not fade - it just gets quieter, more patient. The ${archetype} I became - was it inevitable? Or did I choose it, one small surrender at a time? At ${regret.score}%, I have learned that some questions do not have answers. Just echoes. And the quiet sound of a life unlived.`;

  return { year5, year10, year30, finalReflection };
}
