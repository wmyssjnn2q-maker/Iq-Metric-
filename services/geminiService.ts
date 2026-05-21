
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { UserStats, DetailedAnalysis } from "../types";
import { buildReportInsights } from "../reportHelpers";

export const getAnalysisFallback = (stats: UserStats): DetailedAnalysis =>
  buildReportInsights(stats);

export const generateDetailedReport = async (stats: UserStats): Promise<DetailedAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fallback = buildReportInsights(stats);

  try {
    const domainOrderHint = buildReportInsights(stats).recommendations
      .map((r, i) => `${i + 1}. ${r.title}`)
      .join(", ");

    const schemaProperties: Record<string, unknown> = {
      summary: { type: Type.STRING, description: "Krótkie podsumowanie wyniku (ok 50 słów), z konkretnymi procentami domen." },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista 3-4 mocnych stron z odniesieniem do domen." },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista 2-3 obszarów do rozwoju z procentami." },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            time: { type: Type.STRING },
            diff: { type: Type.STRING },
            desc: { type: Type.STRING },
          },
          required: ["title", "time", "diff", "desc"],
        },
        description: "5 kroków — kolejność od najsłabszej domeny.",
      },
      careerPaths: { type: Type.ARRAY, items: { type: Type.STRING } },
      personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
    };

    const apiCall = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Przeanalizuj wyniki testu IQ: Wynik ${stats.iqScore}, percentyl ${stats.percentile}%.
      Domeny (%): Matryce ${stats.domainScores.MATRIX}, Ciągi ${stats.domainScores.NUMBER_SERIES}, Logika ${stats.domainScores.LOGIC}, Przestrzeń ${stats.domainScores.SPATIAL}, Analogie ${stats.domainScores.ANALOGY}.
      Kolejność planu: ${domainOrderHint}.
      Pisz po polsku, prosto. W summary, strengths i weaknesses podawaj konkretne nazwy domen i procenty z wyników.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: schemaProperties,
          required: ["summary", "strengths", "weaknesses", "recommendations", "careerPaths", "personalityTraits"],
        },
      },
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
    const response = await Promise.race([apiCall, timeoutPromise]);

    if (!response?.text) return fallback;

    const parsed = JSON.parse(response.text.trim()) as DetailedAnalysis;
    return {
      summary: parsed.summary?.includes(String(stats.iqScore)) ? parsed.summary : fallback.summary,
      strengths: parsed.strengths?.length ? parsed.strengths : fallback.strengths,
      weaknesses: parsed.weaknesses?.length ? parsed.weaknesses : fallback.weaknesses,
      recommendations: fallback.recommendations,
      careerPaths: parsed.careerPaths?.length ? parsed.careerPaths : fallback.careerPaths,
      personalityTraits: parsed.personalityTraits?.length ? parsed.personalityTraits : fallback.personalityTraits,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallback;
  }
};

export const getAIAssistance = async (query: string, stats: UserStats) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: `Jesteś ekspertem psychometrii IQ Matrix. Pomagasz użytkownikowi zrozumieć jego wyniki: ${JSON.stringify(stats)}. Odpowiadaj krótko i merytorycznie po polsku.`,
    },
  });
  const response = await chat.sendMessage({ message: query });
  return response.text;
};
