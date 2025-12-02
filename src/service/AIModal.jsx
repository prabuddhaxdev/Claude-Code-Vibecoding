import { AI_PROMPT } from "@/constants/options";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
});

export async function generatePlanFromAI() {

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: AI_PROMPT }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    // Note: it's result.text (property), not result.text() (method)
    return result.text;
  } catch (error) {
    console.error("Error in generatePlanFromAI:", error);
    throw error;
  }
}