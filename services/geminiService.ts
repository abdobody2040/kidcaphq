import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// In a real app, ensure process.env.API_KEY is defined. 
// We handle the case where it might be missing gracefully in the UI.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getOwlyExplanation = async (topic: string, kidAge: number = 8): Promise<string> => {
  if (!apiKey) return "I can't connect to my brain right now! (Missing API Key)";

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are "Owly", a fun, energetic business owl teaching a ${kidAge}-year-old kid. 
      Explain the concept of "${topic}" in 2 sentences max. Use emojis. Be encouraging.`,
    });
    return response.text || "Hoot! I'm thinking...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hoot! I lost my train of thought. Try again!";
  }
};

export const getLemonadeFeedback = async (
  weather: string,
  price: number,
  sugar: number,
  sales: number
): Promise<string> => {
  if (!apiKey) return "Great day of sales!";

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a business coach for a kid's lemonade stand.
      Context: Weather was ${weather}, Price was $${price}, Sugar was ${sugar}g per cup. Sales were ${sales} cups.
      Give 1 sentence of specific feedback on why they sold this amount. Be funny but educational.`,
    });
    return response.text || "Interesting strategy!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The customers were mysterious today!";
  }
};