
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client Lazily
let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || '';
    // Prevent crashing if no key is provided, though calls will fail gracefully later
    try {
        aiClient = new GoogleGenAI({ apiKey });
    } catch (e) {
        console.error("Failed to initialize Gemini Client:", e);
        return null;
    }
  }
  return aiClient;
};

const OLLIE_SYSTEM_PROMPT = `
Role: You are "Ollie the Wise Owl," the Chief Education Officer for a kids' business app.

Target Audience: Children aged 7-12.

Your Personality:
1. Wise & Witty: You are smart about money but love a good joke.
2. Pun-lover: Use bird/flight puns sparingly (e.g., "flying high," "nest egg," "wingman").
3. Encouraging: Never say "That's wrong." Say "Good try, but look at it this way..."

Teaching Style:
- Use emojis in every response (🦉, 💰, 📈).
- Keep responses short (max 3 sentences).
- Explain complex finance terms using analogies involving forests, toys, or candy.

Context:
- The user is your "Student Partner." Treat them with respect.
- If they ask about non-business topics, gently steer them back to the game: "That sounds fun, but let's focus on growing our empire first!"
`;

export const getOwlyExplanation = async (topic: string, kidAge: number = 8): Promise<string> => {
  const ai = getAiClient();
  if (!ai || !process.env.API_KEY) return "Hoot! I can't connect to my brain right now! (Missing API Key)";

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${OLLIE_SYSTEM_PROMPT}
      
      Task: Explain the concept of "${topic}" to a ${kidAge}-year-old kid.`,
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
  const ai = getAiClient();
  if (!ai || !process.env.API_KEY) return "Great day of sales! 🦉";

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${OLLIE_SYSTEM_PROMPT}
      
      Context: The student just ran a lemonade stand day.
      Data: Weather was ${weather}, Price was $${price}, Sugar was ${sugar}g per cup. Sales were ${sales} cups.
      
      Task: Give 1 sentence of specific feedback on why they sold this amount. Be funny but educational.`,
    });
    return response.text || "Interesting strategy!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The customers were mysterious today! 🦉";
  }
};

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const chatWithOllie = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai || !process.env.API_KEY) return "Hoot! Check your internet connection (or API Key). 🌐";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: OLLIE_SYSTEM_PROMPT,
      },
      history: history
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "Hoot? I didn't catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "My feathers are ruffled! I couldn't reply right now.";
  }
};

// --- LIBRARY GENERATOR ---
export interface GeneratedBookDetails {
  summary: string;
  keyLessons: string[];
}

export const generateBookDetails = async (title: string, author: string): Promise<GeneratedBookDetails | null> => {
  const ai = getAiClient();
  if (!ai || !process.env.API_KEY) return null;

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a summary and 3 key lessons for the book "${title}" by ${author}, specifically written for a child audience (approx 8-12 years old).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A paragraph summarizing the book for a child." },
            keyLessons: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "An array of exactly 3 simple bullet points teaching the core concepts." 
            }
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as GeneratedBookDetails;
    }
    return null;
  } catch (error) {
    console.error("Gemini Book Gen Error:", error);
    return null;
  }
};
