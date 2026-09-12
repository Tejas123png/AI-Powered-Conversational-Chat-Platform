import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Models in priority order - confirmed available on this API key
const MODELS = [
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

const getAIresponse = async (message) => {
  let lastErr;
  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: message,
      });
      return response.text;
    } catch (err) {
      lastErr = err;
      // Retry on model-unavailability (404 or deprecated model message)
      const isModelError =
        err.status === 404 ||
        err.message?.toLowerCase().includes("not found") ||
        err.message?.toLowerCase().includes("no longer available");
      if (!isModelError) {
        throw err; // Non-model error - don't retry
      }
      console.warn(`Model ${model} unavailable, trying next...`);
    }
  }
  throw lastErr;
};

export default getAIresponse;