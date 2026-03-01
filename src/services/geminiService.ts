import { GoogleGenAI, Type } from "@google/genai";
import { Event } from "../types";

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export async function parseEventFromText(text: string): Promise<Event> {
  if (!API_KEY) {
    throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Current date for context: Sunday, March 1, 2026
  const todayContext = "Today is Sunday, March 1, 2026.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${todayContext}
    Parse the following text and extract event details for an SFU (Simon Fraser University) club event. 
    
    Instructions:
    1. Infer the exact start and end dates based on relative terms like 'today', 'tomorrow', 'next Monday', etc.
    2. If only a start time is given, assume the event lasts 1 hour.
    3. Assume the year is 2026.
    4. SFU campuses are Burnaby, Surrey, or Vancouver. If not mentioned, default to Burnaby.
    5. Categories must be one of: Social, Career, Academic, Culture, Sports, Volunteer, Other.
    6. Source types must be one of: Discord, Instagram, SFU. Default to Discord if unclear.
    7. Snacks: Determine if food is mentioned. If yes, list types (e.g., ["Pizza", "Cookies"]).
    8. freeToJoin: Default to true unless membership fees are mentioned.
    9. joinLink/sourceLink: If no link is found, use 'https://sfu.ca'.
    
    Text to parse: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          club: { type: Type.STRING },
          campus: { type: Type.STRING, enum: ["Burnaby", "Surrey", "Vancouver"] },
          location: { type: Type.STRING },
          start: { type: Type.STRING, description: "ISO 8601 string with -08:00 offset (e.g. 2026-03-01T17:00:00-08:00)" },
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
