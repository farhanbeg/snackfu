import { GoogleGenAI, Type } from "@google/genai";
import { Event } from "../types";

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export async function parseEventFromText(text: string): Promise<Event> {
  if (!API_KEY) {
    throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse the following text and extract event details for an SFU club event. 
    Infer missing details if possible (e.g., if it says 'next Monday' and today is March 1, 2026, calculate the date).
    Assume the year is 2026 if not specified.
    SFU campuses are Burnaby, Surrey, Vancouver.
    Categories are Social, Career, Academic, Culture, Sports, Volunteer, Other.
    Source types are Discord, Instagram, SFU.
    
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          club: { type: Type.STRING },
          campus: { type: Type.STRING, enum: ["Burnaby", "Surrey", "Vancouver"] },
          location: { type: Type.STRING },
          start: { type: Type.STRING, description: "ISO 8601 string with -08:00 offset" },
          end: { type: Type.STRING, description: "ISO 8601 string with -08:00 offset" },
          category: { type: Type.STRING, enum: ["Social", "Career", "Academic", "Culture", "Sports", "Volunteer", "Other"] },
          snacks: {
            type: Type.OBJECT,
            properties: {
              has: { type: Type.BOOLEAN },
              types: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["has"]
          },
          freeToJoin: { type: Type.BOOLEAN },
          joinLink: { type: Type.STRING },
          sourceType: { type: Type.STRING, enum: ["Discord", "Instagram", "SFU"] },
          sourceLink: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "club", "campus", "location", "start", "end", "category", "snacks", "freeToJoin", "joinLink", "sourceType", "sourceLink"]
      }
    }
  });

  const eventData = JSON.parse(response.text);
  return {
    ...eventData,
    id: `parsed-${Date.now()}`
  };
}
