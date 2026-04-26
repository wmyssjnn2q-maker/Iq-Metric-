
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
          { title: "Teoria Gier", time: "20 min", diff: "Wysoki", desc: "Poznaj zasady podejmowania najlepszych decyzji." },
          { title: "Programowanie", time: "30 min", diff: "Wysoki", desc: "Trenuj czystą logikę poprzez pisanie kodu." },
          { title: "Filozofia", time: "15 min", diff: "Średni", desc: "Rozwijaj precyzyjne myślenie i argumentację." }
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
          { title: "Trening Matryc", time: "10 min", diff: "Średni", desc: "Ćwicz dostrzeganie reguł zmieniających się naraz." },
          { title: "Sudoku", time: "15 min", diff: "Średni", desc: "Idealny trening dla logicznego myślenia." },
          { title: "Zagadki Logiczne", time: "10 min", diff: "Średni", desc: "Rozwiązywanie problemów o różnej trudności." }
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
          { title: "Podstawy Logiki", time: "10 min", diff: "Niski", desc: "Proste ćwiczenia na wyciąganie wniosków." },
          { title: "Puzzle 3D", time: "15 min", diff: "Niski", desc: "Zabawa formą, która rozwija wyobraźnię." },
          { title: "Gry Słowne", time: "15 min", diff: "Niski", desc: "Rozwijanie zasobu słów i sprawności kojarzenia." }
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
            diff: { type: Type.STRING, description: "Trudność: 'Niski', 'Średni', 'Wysoki'" },
            desc: { type: Type.STRING }
          },
          required: ["title", "time", "diff", "desc"]
        },
        description: "Dokładnie 5 spersonalizowanych rekomendacji ćwiczeń."
      },
      careerPaths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 sugerowane ścieżki kariery pasujące do profilu." },
      personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 cechy osobowości często skorelowane z tym profilem." }
    };

    const requiredFields = ["summary", "strengths", "weaknesses", "recommendations", "careerPaths", "personalityTraits"];

    const apiCall = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Przeanalizuj wyniki testu IQ: Wynik ogólny ${stats.iqScore} (Percentyl ${stats.percentile}). 
      Wyniki domenowe: Matryce: ${stats.domainScores.MATRIX}, Ciągi: ${stats.domainScores.NUMBER_SERIES}, 
      Logika: ${stats.domainScores.LOGIC}, Przestrzeń: ${stats.domainScores.SPATIAL}, Analogie: ${stats.domainScores.ANALOGY}.
      Stwórz szczegółowy raport psychometryczny.`,
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
