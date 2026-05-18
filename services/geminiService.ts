
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { UserStats, DetailedAnalysis } from "../types";

// Note: GoogleGenAI is instantiated inside functions to ensure the latest API key is used as per guidelines.

export const generateDetailedReport = async (stats: UserStats): Promise<DetailedAnalysis | null> => {
  // Always create a new instance right before the call to pick up any key changes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const getFallback = (score: number): DetailedAnalysis => {
    if (score >= 120) {
      return {
        summary: `Twój wynik (${score}) jest wybitny! Masz bardzo jasny umysł i błyskawicznie rozwiązujesz nawet najtrudniejsze zagadki logiczne.`,
        strengths: ["Błyskawiczne łączenie faktów", "Świetna intuicja i wyobraźnia", "Bardzo szybkie uczenie się"],
        weaknesses: ["Zbyt głębokie analizowanie prostych spraw", "Niecierpliwość przy powolnych zadaniach"],
        recommendations: [
          { title: "Krok 1: Macierze", time: "10 min dziennie", diff: "Łatwe", desc: "Rozwiązuj 5 prostych zadań z układem 3×3. Szukaj, co zmienia się w wierszu i kolumnie." },
          { title: "Krok 2: Przestrzeń", time: "15 min dziennie", diff: "Średnie", desc: "Składaj puzzle lub rysuj bryły z dwóch stron — ćwicz obracanie figur w głowie." },
          { title: "Krok 3: Logika", time: "10 min dziennie", diff: "Średnie", desc: "Krótkie zagadki „kto mówi prawdę” — zapisuj krok po kroku, dlaczego tak wnioskujesz." },
        ],
        careerPaths: ["Architekt Systemów", "Strateg", "Naukowiec"],
        personalityTraits: ["Otwartość", "Innowacyjność", "Niezależność"]
      };
    } else if (score >= 90) {
      return {
        summary: `Twój wynik (${score}) jest bardzo solidny. Dobrze radzisz sobie z codziennymi wyzwaniami i szybko przyswajasz nową wiedzę.`,
        strengths: ["Logiczne i uporządkowane myślenie", "Dobre dostrzeganie schematów", "Jasne wyciąganie wniosków"],
        weaknesses: ["Trudniejsze zadania przestrzenne (3D)", "Praca pod bardzo dużą presją czasu"],
        recommendations: [
          { title: "Krok 1: Macierze", time: "10 min dziennie", diff: "Średnie", desc: "Ćwicz układy 3×3 — zapisuj regułę w każdym wierszu." },
          { title: "Krok 2: Ciągi liczb", time: "10 min dziennie", diff: "Łatwe", desc: "Znajdź przyrost w ciągu (np. +2, +3) i sprawdź na kolejnych liczbach." },
          { title: "Krok 3: Analogie", time: "10 min dziennie", diff: "Średnie", desc: "Pary słów: szukaj tej samej relacji, nie tylko podobieństwa." },
        ],
        careerPaths: ["Manager", "Analityk", "Inżynier"],
        personalityTraits: ["Zrównoważenie", "Skrupulatność", "Praktyczność"]
      };
    } else {
      return {
        summary: `Twój wynik (${score}) to dobry początek. Masz konkretne podejście do życia, a regularny trening pomoże Ci jeszcze bardziej wyostrzyć myślenie.`,
        strengths: ["Praktyczne rozwiązywanie problemów", "Dbałość o ważne szczegóły", "Dobre wyczucie relacji między faktami"],
        weaknesses: ["Szybka analiza dużej ilości danych", "Zadania oparte na czystej logice"],
        recommendations: [
          { title: "Krok 1: Logika", time: "10 min dziennie", diff: "Łatwe", desc: "Proste zagadki z dwoma zdaniami — kto na pewno kłamie?" },
          { title: "Krok 2: Macierze", time: "10 min dziennie", diff: "Łatwe", desc: "Zacznij od najprostszych układów 3×3 w internecie." },
          { title: "Krok 3: Pamięć", time: "5 min dziennie", diff: "Łatwe", desc: "Zapamiętaj 5 cyfr, potem 6 — bez pośpiechu." },
        ],
        careerPaths: ["Koordynator", "Specjalista", "Doradca"],
        personalityTraits: ["Konkretność", "Cierpliwość", "Uważność"]
      };
    }
  };

  const fallback = getFallback(stats.iqScore);

  try {
    const schemaProperties: any = {
      summary: { type: Type.STRING, description: "Krótkie podsumowanie wyniku i jego znaczenia (ok 50 słów)." },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista 3-4 mocnych stron poznawczych." },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista 2-3 obszarów do rozwoju." },
      recommendations: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            time: { type: Type.STRING, description: "Czas trwania np. '10 min'" },
            diff: { type: Type.STRING, description: "Trudność: 'Łatwe', 'Średnie' lub 'Trudniejsze'" },
            desc: { type: Type.STRING, description: "Jedno zdanie: co konkretnie robić (prosty język, bez żargonu)" }
          },
          required: ["title", "time", "diff", "desc"]
        },
        description: "Dokładnie 5 kroków planu rozwoju (Krok 1–5), od najsłabszej domeny. Tytuły krótkie, opisy po polsku, zrozumiałe dla każdego."
      },
      careerPaths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 sugerowane ścieżki kariery pasujące do profilu." },
      personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 cechy osobowości często skorelowane z tym profilem." }
    };

    const requiredFields = ["summary", "strengths", "weaknesses", "recommendations", "careerPaths", "personalityTraits"];

    const apiCall = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Przeanalizuj wyniki testu IQ: Wynik ogólny ${stats.iqScore} (Percentyl ${stats.percentile}${stats.ageBracketLabel ? ` w grupie wiekowej: ${stats.ageBracketLabel}` : ''}). 
      Wyniki domenowe: Matryce: ${stats.domainScores.MATRIX}, Ciągi: ${stats.domainScores.NUMBER_SERIES}, 
      Logika: ${stats.domainScores.LOGIC}, Przestrzeń: ${stats.domainScores.SPATIAL}, Analogie: ${stats.domainScores.ANALOGY}.
      Uwzględnij w interpretacji zadeklarowany przedział wiekowy użytkownika (jeśli podany). Pisz prostym językiem (bez żargonu psychologicznego). W rekomendacjach podaj konkretne, krótkie ćwiczenia na każdy dzień.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: schemaProperties,
          required: requiredFields
        }
      },
    });
    
    // Timeout after 8 seconds to prevent long loading screens
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
    const response = await Promise.race([apiCall, timeoutPromise]);
    
    if (!response) {
      console.warn("Gemini API timeout, using fallback");
      return fallback;
    }

    if (!response.text) return fallback;
    const parsed = JSON.parse(response.text.trim()) as DetailedAnalysis;
    
    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error);
    return fallback;
  }
};

export const getAIAssistance = async (query: string, stats: UserStats) => {
    // Always create a new instance right before the call to pick up any key changes
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: `Jesteś ekspertem psychometrii IQ Matrix. Pomagasz użytkownikowi zrozumieć jego wyniki: ${JSON.stringify(stats)}. Odpowiadaj krótko i merytorycznie po polsku.`,
        }
    });
    const response = await chat.sendMessage({ message: query });
    // Accessing .text property directly as per @google/genai guidelines
    return response.text;
};
