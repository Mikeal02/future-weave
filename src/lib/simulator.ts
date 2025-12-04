// Life Path Types
export type LifePath = 'safe' | 'risky' | 'chaotic' | 'disciplined' | 'lazy' | 'obsessive';

export interface DecisionSliders {
  careerFocus: number;
  moneyDiscipline: number;
  healthFitness: number;
  relationships: number;
  learningGrowth: number;
  riskTaking: number;
}

export interface OutcomeScore {
  score: number;
  severity: 'critical' | 'unstable' | 'balanced' | 'strong' | 'elite';
}

export interface Outcomes {
  financial: OutcomeScore;
  social: OutcomeScore;
  health: OutcomeScore;
  mentalStability: OutcomeScore;
}

export interface RegretData {
  score: number;
  intensity: 'low' | 'medium' | 'heavy' | 'existential';
  primaryCause: string;
  topDecisions: string[];
}

export interface PointOfNoReturn {
  year: number;
  warning: string;
  recoveryDifficulty: 'moderate' | 'hard' | 'nearly-impossible';
}

export interface SimulationResult {
  outcomes: Outcomes;
  regret: RegretData;
  pointOfNoReturn: PointOfNoReturn;
  narratives: {
    year5: string;
    year10: string;
    year30: string;
  };
  dailyMicroRegret: string;
  finalReflection: string;
  archetype: string;
}

// Life path multipliers
const pathMultipliers: Record<LifePath, Record<string, number>> = {
  safe: { financial: 1.1, social: 1.0, health: 1.1, mental: 1.2, regret: 0.8 },
  risky: { financial: 1.3, social: 0.9, health: 0.9, mental: 0.8, regret: 1.2 },
  chaotic: { financial: 0.7, social: 1.1, health: 0.7, mental: 0.6, regret: 1.4 },
  disciplined: { financial: 1.2, social: 0.9, health: 1.3, mental: 1.1, regret: 0.7 },
  lazy: { financial: 0.6, social: 1.0, health: 0.5, mental: 0.9, regret: 1.5 },
  obsessive: { financial: 1.4, social: 0.6, health: 0.8, mental: 0.5, regret: 1.3 },
};

function getSeverity(score: number): OutcomeScore['severity'] {
  if (score <= 20) return 'critical';
  if (score <= 40) return 'unstable';
  if (score <= 60) return 'balanced';
  if (score <= 80) return 'strong';
  return 'elite';
}

function getRegretIntensity(score: number): RegretData['intensity'] {
  if (score <= 25) return 'low';
  if (score <= 50) return 'medium';
  if (score <= 75) return 'heavy';
  return 'existential';
}

export function calculateOutcomes(path: LifePath, sliders: DecisionSliders): Outcomes {
  const multipliers = pathMultipliers[path];
  
  // Financial outcome
  const financialBase = (sliders.careerFocus * 0.4 + sliders.moneyDiscipline * 0.4 + sliders.riskTaking * 0.2);
  const financialScore = Math.min(100, Math.max(0, financialBase * multipliers.financial));
  
  // Social outcome
  const socialBase = (sliders.relationships * 0.5 + sliders.careerFocus * 0.2 + (100 - sliders.riskTaking) * 0.3);
  const socialScore = Math.min(100, Math.max(0, socialBase * multipliers.social));
  
  // Health outcome
  const healthBase = (sliders.healthFitness * 0.6 + sliders.moneyDiscipline * 0.2 + (100 - sliders.riskTaking) * 0.2);
  const healthScore = Math.min(100, Math.max(0, healthBase * multipliers.health));
  
  // Mental stability outcome
  const mentalBase = (sliders.relationships * 0.3 + sliders.learningGrowth * 0.3 + sliders.healthFitness * 0.2 + (100 - sliders.riskTaking) * 0.2);
  const mentalScore = Math.min(100, Math.max(0, mentalBase * multipliers.mental));
  
  return {
    financial: { score: Math.round(financialScore), severity: getSeverity(financialScore) },
    social: { score: Math.round(socialScore), severity: getSeverity(socialScore) },
    health: { score: Math.round(healthScore), severity: getSeverity(healthScore) },
    mentalStability: { score: Math.round(mentalScore), severity: getSeverity(mentalScore) },
  };
}

export function calculateRegret(path: LifePath, sliders: DecisionSliders, outcomes: Outcomes): RegretData {
  const multipliers = pathMultipliers[path];
  
  // Calculate base regret from unbalanced decisions
  const avgSlider = Object.values(sliders).reduce((a, b) => a + b, 0) / 6;
  const sliderVariance = Object.values(sliders).reduce((acc, val) => acc + Math.pow(val - avgSlider, 2), 0) / 6;
  
  // Higher variance = more regret potential
  const varianceRegret = Math.sqrt(sliderVariance) * 0.5;
  
  // Low outcomes contribute to regret
  const outcomeRegret = (100 - outcomes.financial.score) * 0.25 + 
                        (100 - outcomes.social.score) * 0.25 + 
                        (100 - outcomes.health.score) * 0.25 + 
                        (100 - outcomes.mentalStability.score) * 0.25;
  
  const baseRegret = (varianceRegret + outcomeRegret * 0.5) * multipliers.regret;
  const regretScore = Math.min(100, Math.max(0, baseRegret));
  
  // Determine primary cause
  const causes = [
    { name: 'Career Neglect', score: 100 - sliders.careerFocus },
    { name: 'Financial Recklessness', score: 100 - sliders.moneyDiscipline },
    { name: 'Health Deterioration', score: 100 - sliders.healthFitness },
    { name: 'Relationship Abandonment', score: 100 - sliders.relationships },
    { name: 'Stagnation', score: 100 - sliders.learningGrowth },
    { name: 'Reckless Risk-Taking', score: sliders.riskTaking > 70 ? sliders.riskTaking : 0 },
    { name: 'Fear of Risk', score: sliders.riskTaking < 30 ? 100 - sliders.riskTaking : 0 },
  ].sort((a, b) => b.score - a.score);
  
  return {
    score: Math.round(regretScore),
    intensity: getRegretIntensity(regretScore),
    primaryCause: causes[0].name,
    topDecisions: [causes[0].name, causes[1].name],
  };
}

export function calculatePointOfNoReturn(path: LifePath, sliders: DecisionSliders, outcomes: Outcomes): PointOfNoReturn {
  const avgOutcome = (outcomes.financial.score + outcomes.social.score + outcomes.health.score + outcomes.mentalStability.score) / 4;
  
  let year = 15;
  let warning = '';
  let difficulty: PointOfNoReturn['recoveryDifficulty'] = 'moderate';
  
  if (avgOutcome < 30) {
    year = 5;
    difficulty = 'nearly-impossible';
    warning = 'Critical trajectory detected. Immediate intervention required.';
  } else if (avgOutcome < 50) {
    year = 10;
    difficulty = 'hard';
    warning = 'Declining path identified. Major course correction needed.';
  } else if (avgOutcome < 70) {
    year = 15;
    difficulty = 'moderate';
    warning = 'Suboptimal trajectory. Adjustments recommended.';
  } else {
    year = 25;
    difficulty = 'moderate';
    warning = 'Stable path with room for optimization.';
  }
  
  // Adjust based on path
  if (path === 'chaotic' || path === 'lazy') {
    year = Math.max(5, year - 5);
    difficulty = difficulty === 'moderate' ? 'hard' : 'nearly-impossible';
  }
  
  return { year, warning, recoveryDifficulty: difficulty };
}

export function generateArchetype(path: LifePath, outcomes: Outcomes, regret: RegretData): string {
  const avgOutcome = (outcomes.financial.score + outcomes.social.score + outcomes.health.score + outcomes.mentalStability.score) / 4;
  
  if (avgOutcome >= 80 && regret.score <= 20) return 'The Fulfilled Architect';
  if (avgOutcome >= 70 && regret.score <= 40) return 'The Balanced Navigator';
  if (path === 'risky' && outcomes.financial.score >= 70) return 'The Calculated Gambler';
  if (path === 'safe' && regret.score >= 60) return 'The Comfortable Regretter';
  if (path === 'obsessive' && outcomes.financial.score >= 80) return 'The Driven Achiever';
  if (path === 'obsessive' && outcomes.social.score <= 30) return 'The Lonely Climber';
  if (path === 'chaotic' && avgOutcome <= 40) return 'The Wandering Soul';
  if (path === 'lazy' && regret.score >= 70) return 'The Haunted Dreamer';
  if (path === 'disciplined' && avgOutcome >= 60) return 'The Steady Builder';
  if (outcomes.health.score <= 30) return 'The Burned Out';
  if (outcomes.social.score <= 30) return 'The Isolated Achiever';
  if (regret.score >= 80) return 'The Heavy Heart';
  
  return 'The Uncertain Traveler';
}

export function generateDailyMicroRegret(path: LifePath, sliders: DecisionSliders): string {
  const messages = {
    safe: [
      `Your comfort-seeking pattern today increases long-term stagnation risk by ${Math.round(3 + Math.random() * 5)}%.`,
      `Another day of playing it safe. Future you wonders what could have been.`,
      `Security feels good now. But at what cost to your potential?`,
    ],
    risky: [
      `Your impulsive tendencies today elevate burnout probability by ${Math.round(4 + Math.random() * 6)}%.`,
      `High risk, high reward—or high regret. Today added to the gamble.`,
      `The adrenaline fades. The consequences remain.`,
    ],
    chaotic: [
      `Your scattered focus today compounds decision fatigue by ${Math.round(5 + Math.random() * 7)}%.`,
      `Chaos breeds more chaos. Today was no exception.`,
      `Without direction, every path leads to the same regret.`,
    ],
    disciplined: [
      `Your rigid routine today marginally increases isolation risk by ${Math.round(2 + Math.random() * 3)}%.`,
      `Structure serves you well—until it becomes a prison.`,
      `Discipline is a tool. Don't let it become your identity.`,
    ],
    lazy: [
      `Your avoidance pattern today increases long-term regret risk by ${Math.round(6 + Math.random() * 8)}%.`,
      `Rest is necessary. But this isn't rest—it's retreat.`,
      `Every day of inaction is a vote for your future regrets.`,
    ],
    obsessive: [
      `Your overwork pattern today depletes resilience reserves by ${Math.round(4 + Math.random() * 5)}%.`,
      `Achievement at what cost? Your relationships silently suffer.`,
      `The goal moves further away the harder you chase it.`,
    ],
  };
  
  const pathMessages = messages[path];
  return pathMessages[Math.floor(Math.random() * pathMessages.length)];
}

export function generateShareableRegret(archetype: string, regretScore: number, primaryCause: string): string {
  const sentences = [
    `At ${regretScore}% regret, I learned that ${primaryCause.toLowerCase()} shapes more than we admit.`,
    `The ${archetype} in me carries ${regretScore}% regret—mostly from ${primaryCause.toLowerCase()}.`,
    `${regretScore}% of my simulated future regrets stem from one thing: ${primaryCause.toLowerCase()}.`,
  ];
  return sentences[Math.floor(Math.random() * sentences.length)];
}
