
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { UserStats, DetailedAnalysis } from "../types";

// Note: GoogleGenAI is instantiated inside functions to ensure the latest API key is used as per guidelines.

export const generateDetailedReport = async (stats: UserStats): Promise<DetailedAnalysis | null> => {
  // Always create a new instance right before the call to pick up any key changes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const getFallback = (score: number): DetailedAnalysis => {
    if (score >= 120) {
      return {
        summary: `Twój wybitny wynik (${score}) plasuje Cię w górnych 10% populacji. Wykazujesz nadzwyczajne zdolności w zakresie myślenia abstrakcyjnego i rozwiązywania złożonych problemów logicznych.`,
        strengths: ["Zaawansowana synteza danych", "Wybitna wyobraźnia przestrzenna", "Szybka adaptacja poznawcza"],
        weaknesses: ["Skłonność do nadmiernej analizy", "Niecierpliwość przy prostych zadaniach"],
        recommendations: [
          { title: "Teoria Gier", time: "20 min", diff: "Wysoki", desc: "Analiza strategii w grach o sumie niezerowej." },
          { title: "Programowanie Funkcyjne", time: "30 min", diff: "Wysoki", desc: "Nauka paradygmatów deklaratywnych dla rozwoju logiki." },
          { title: "Szachy - Strategia", time: "15 min", diff: "Średni", desc: "Analiza końcówek i planowania długofalowego." },
          { title: "Kryptografia", time: "20 min", diff: "Wysoki", desc: "Łamanie szyfrów podstawieniowych i blokowych." },
          { title: "Filozofia Analityczna", time: "15 min", diff: "Średni", desc: "Analiza argumentacji i błędów logicznych." }
        ],
        careerPaths: ["Naukowiec", "Główny Architekt IT", "Strateg Biznesowy"],
        personalityTraits: ["Wysoka otwartość", "Innowacyjność", "Niezależność myślenia"]
      };
    } else if (score >= 90) {
      return {
        summary: `Twój wynik (${score}) jest w pełni satysfakcjonujący i mieści się w szerokiej normie. Posiadasz solidny fundament do nauki nowych umiejętności i sprawnego funkcjonowania w wymagającym środowisku.`,
        strengths: ["Dobra pamięć robocza", "Logiczne wyciąganie wniosków", "Rozpoznawanie wzorców"],
        weaknesses: ["Złożona rotacja 3D", "Presja czasu w zadaniach abstrakcyjnych"],
        recommendations: [
          { title: "Trening Matryc", time: "10 min", diff: "Średni", desc: "Zadania oparte na zmianie dwóch zmiennych jednocześnie." },
          { title: "Sudoku Expert", time: "15 min", diff: "Średni", desc: "Rozwijanie eliminacji logicznej i dedukcji." },
          { title: "Pamięć Operacyjna", time: "5 min", diff: "Niski", desc: "Ciągi cyfr wstecznie i naprzemiennie." },
          { title: "Analiza Tekstu", time: "10 min", diff: "Średni", desc: "Wyłapywanie niespójności w artykułach naukowych." },
          { title: "Szybkie Czytanie", time: "15 min", diff: "Średni", desc: "Trening poszerzania pola widzenia i szybkiego skanowania tekstu." }
        ],
        careerPaths: ["Menedżer Projektu", "Inżynier", "Specjalista ds. Analiz"],
        personalityTraits: ["Sumienność", "Stabilność", "Praktyczne podejście"]
      };
    } else {
      return {
        summary: `Twój wynik (${score}) wskazuje na potencjał do rozwoju w obszarach myślenia analitycznego. Skupienie się na systematycznym treningu poznawczym pozwoli Ci znacząco poprawić sprawność operacyjną mózgu.`,
        strengths: ["Praktyczne rozwiązywanie problemów", "Uwaga selektywna", "Podstawowe analogie"],
        weaknesses: ["Abstrakcyjne matryce logiczne", "Szybkość przetwarzania danych"],
        recommendations: [
          { title: "Podstawy Logiki", time: "10 min", diff: "Niski", desc: "Proste sylogizmy i relacje między zbiorami." },
          { title: "Puzzle Przestrzenne", time: "15 min", diff: "Niski", desc: "Układanie brył z rzutów bocznych." },
          { title: "Trening Skupienia", time: "5 min", diff: "Niski", desc: "Eliminowanie dystraktorów w zadaniach typu Stroop." },
          { title: "Arytmetyka Mentalna", time: "10 min", diff: "Niski", desc: "Szybkie liczenie w pamięci bez użycia kartki." },
          { title: "Gry Słowne", time: "15 min", diff: "Niski", desc: "Rozwijanie zasobu słownictwa i analogii werbalnych." }
        ],
        careerPaths: ["Koordynator Operacyjny", "Specjalista Techniczny", "Doradca Klienta"],
        personalityTraits: ["Empatia", "Wytrwałość", "Zorientowanie na detale"]
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
