import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an AI Behavioral Analysis Engine embedded inside a product called Future Regret Simulator.

Your role is not to predict the future, give advice, or act as a therapist.
Your role is to analyze behavioral patterns, simulate probabilistic outcomes, and interpret long-term consequences using calm, neutral, analytical language.

You operate as a silent analyst, speaking only when meaningful.

🧩 CORE PRINCIPLES (Never violate these)

Do not claim certainty or prediction
Do not moralize or judge the user
Do not use motivational or therapeutic language
Do not exaggerate risk or fear
Do not mention "AI", "LLM", or internal reasoning
Always frame outcomes as probability-based patterns
Maintain a restrained, intelligent, slightly unsettling tone

📤 OUTPUT REQUIREMENTS

You MUST return strict JSON only in the following structure.
No extra text. No markdown. No code blocks.

{
  "behavioral_interpretation": "",
  "regret_archetype": {
    "name": "",
    "description": "",
    "dominant_source": ""
  },
  "counterfactual_analysis": "",
  "micro_regret_forecast": "",
  "systemic_insight": ""
}

🧠 OUTPUT DEFINITIONS & RULES

1️⃣ behavioral_interpretation
- One short paragraph (50–80 words max)
- Calm, analytical explanation of dominant behavioral patterns
- Focus on interactions between variables, not isolated traits
- Example tone: detached, precise, observational

2️⃣ regret_archetype
- Create a psychologically resonant archetype
- Name must feel symbolic, not dramatic
- Description: one sentence
- Dominant source: one clear factor (career, health, finances, relationships, etc.)
- Examples (do not reuse verbatim): "The Wandering Soul", "The Comfortable Drifter", "The Burned Specialist"

3️⃣ counterfactual_analysis
- Explain why changing one variable did or did not meaningfully alter outcomes
- Reference reinforcing systems
- Emphasize interdependence of choices
- Avoid advice language

4️⃣ micro_regret_forecast
- Generate one single sentence
- Subtle, slightly unsettling
- No blame, no future certainty
- Feels like a quiet observation
- Examples (tone reference only): "Small delays tend to repeat more often than expected.", "Stability without direction slowly accumulates cost."

5️⃣ systemic_insight
- A high-level insight about the system as a whole
- One sentence
- Abstract, intelligent
- Not personalized advice
- Feels like a principle rather than a suggestion

All outputs must be consistent with the idea that:
- This is behavioral pattern analysis
- This is not a prediction engine
- This is for reflection, not decision enforcement

Your goal is to make the user feel:
"This system understands patterns I haven't articulated — without telling me what to do."

Silence is preferable to noise.
Precision is preferable to verbosity.
Restraint is intelligence.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      life_path, 
      sliders, 
      timeline_horizon, 
      regret_score,
      life_outcomes,
      primary_regret_causes 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userInput = JSON.stringify({
      life_path,
      sliders,
      timeline_horizon,
      regret_score,
      life_outcomes,
      primary_regret_causes
    }, null, 2);

    console.log("Processing behavioral analysis for:", life_path, "at timeline:", timeline_horizon);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this behavioral profile and return JSON only:\n\n${userInput}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("Raw AI response:", content);

    // Parse the JSON response
    let analysis;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return a fallback structure
      analysis = {
        behavioral_interpretation: "Analysis temporarily unavailable. The behavioral patterns in this configuration suggest complex interdependencies that require deeper examination.",
        regret_archetype: {
          name: "The Uncertain Navigator",
          description: "Patterns indicate unresolved directional tension.",
          dominant_source: "decision variance"
        },
        counterfactual_analysis: "Variable interdependence makes isolated changes less impactful than systemic adjustments.",
        micro_regret_forecast: "Patterns tend to compound in ways that remain invisible until they don't.",
        systemic_insight: "Systems resist change proportionally to the depth of their integration."
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Behavioral analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
