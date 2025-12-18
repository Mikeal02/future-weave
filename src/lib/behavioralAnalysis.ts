import type { BehavioralAnalysisData } from "@/components/BehavioralAnalysis";
import type { LifePath, DecisionSliders, Outcomes, RegretData } from "./simulator";

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/behavioral-analysis`;

interface AnalysisInput {
  lifePath: LifePath;
  sliders: DecisionSliders;
  timelineHorizon: 0 | 5 | 10 | 30;
  regret: RegretData;
  outcomes: Outcomes;
}

export async function fetchBehavioralAnalysis({
  lifePath,
  sliders,
  timelineHorizon,
  regret,
  outcomes
}: AnalysisInput): Promise<BehavioralAnalysisData> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      life_path: lifePath,
      sliders: {
        career_focus: sliders.careerFocus,
        money_discipline: sliders.moneyDiscipline,
        health_fitness: sliders.healthFitness,
        relationships: sliders.relationships,
        learning_growth: sliders.learningGrowth,
        risk_taking: sliders.riskTaking,
      },
      timeline_horizon: `${timelineHorizon} Years`,
      regret_score: regret.score,
      life_outcomes: {
        financial: outcomes.financial.score,
        social: outcomes.social.score,
        health: outcomes.health.score,
        mental_stability: outcomes.mentalStability.score,
      },
      primary_regret_causes: regret.topDecisions,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Analysis failed: ${response.status}`);
  }

  return response.json();
}
