import { GoogleGenAI, Type } from '@google/genai';
import { NormalizedJobRequest, JobCheckOutput, RiskLevel } from './shared/contracts';
import { evaluateJobRisk as evaluateRules } from './riskEngine';

// Server-side initialization using @google/genai SDK
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Server-Side Gemini 3.8 Flash AI Model Evaluation
 * Combines Deep LLM Reasoning with Deterministic Feature Rule Extraction
 */
export async function analyzeJobWithGemini(
  req: NormalizedJobRequest
): Promise<JobCheckOutput> {
  const ai = getGeminiClient();

  // Baseline rule analysis for hybrid ensemble
  const ruleResult = evaluateRules(req);

  // If Gemini API Key is not set in environment, return verified rule evaluation
  if (!ai) {
    return {
      ...ruleResult,
      modelType: 'deterministic-nlp-rules',
    };
  }

  try {
    const prompt = `Analyze the following job posting submission for employment fraud, scam markers, unverified recruiter contact methods, and upfront fee demands.

Job Description Text:
"""
${req.jobText}
"""

Recruiter Email: ${req.email || 'Not provided'}
Company Name: ${req.company || 'Not provided'}
Salary / Pay: ${req.salary || 'Not provided'}

Evaluate the risk level (Low, Medium, or High), calculate a numerical risk score from 0.00 (Safe) to 1.00 (Critical Scam), list explicit red flag bullet points, and provide recommended verification steps for the candidate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert cybersecurity analyst and employment fraud detection model. Analyze job descriptions for phishing, payment traps, task rating scams, and unmonitored chat channels. Return structured JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['riskLevel', 'score', 'redFlags', 'advice'],
          properties: {
            riskLevel: {
              type: Type.STRING,
              description: 'Risk assessment category: Low, Medium, or High',
            },
            score: {
              type: Type.NUMBER,
              description: 'Risk probability score between 0.00 and 1.00',
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of identified deceptive red flag markers',
            },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Recommended verification steps for job seekers',
            },
          },
        },
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      return { ...ruleResult, modelType: 'deterministic-nlp-rules' };
    }

    const parsed = JSON.parse(responseText);

    // Normalize AI values
    let aiScore = typeof parsed.score === 'number' ? parsed.score : ruleResult.score;
    aiScore = Math.min(0.98, Math.max(0.08, parseFloat(aiScore.toFixed(2))));

    let aiRiskLevel: RiskLevel = 'Low';
    if (aiScore >= 0.65) {
      aiRiskLevel = 'High';
    } else if (aiScore >= 0.35) {
      aiRiskLevel = 'Medium';
    }

    const mergedFlags = Array.from(
      new Set([...(parsed.redFlags || []), ...ruleResult.redFlags])
    ).filter((f) => f && f.length > 0);

    const mergedAdvice = Array.from(
      new Set([...(parsed.advice || []), ...ruleResult.advice])
    ).filter((a) => a && a.length > 0);

    return {
      riskLevel: aiRiskLevel,
      risk_level: aiRiskLevel,
      score: aiScore,
      redFlags: mergedFlags.length > 0 ? mergedFlags : ['No primary high-risk triggers detected'],
      red_flags: mergedFlags.length > 0 ? mergedFlags : ['No primary high-risk triggers detected'],
      advice: mergedAdvice,
      factors: req.stage === 'staging' ? ruleResult.factors : undefined,
      modelType: 'hybrid-gemini-2.5-flash',
      stage: req.stage,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[Gemini AI] Server-side analysis notice, using deterministic fallback:', err);
    return {
      ...ruleResult,
      modelType: 'deterministic-nlp-rules',
    };
  }
}
