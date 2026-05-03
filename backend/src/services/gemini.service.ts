import { GoogleGenAI } from '@google/genai';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import dotenv from 'dotenv';

dotenv.config();

const secretManagerClient = new SecretManagerServiceClient();
let genAI: GoogleGenAI | null = null;

async function getApiKey(): Promise<string> {
  // If local/env variable exists, use it
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }

  // Otherwise, fetch from Secret Manager
  const projectId = process.env.PROJECT_ID || 'prompt-wars-495105';
  const secretName = `projects/${projectId}/secrets/GEMINI_API_KEY/versions/latest`;
  
  try {
    const [version] = await secretManagerClient.accessSecretVersion({
      name: secretName,
    });
    const payload = version.payload?.data?.toString();
    if (!payload) {
      throw new Error('Secret payload is empty');
    }
    return payload;
  } catch (error) {
    console.error('Failed to fetch from Secret Manager:', error);
    throw new Error('Failed to retrieve API key');
  }
}

export async function askGemini(query: string): Promise<string> {
  if (!genAI) {
    const apiKey = await getApiKey();
    genAI = new GoogleGenAI({ apiKey });
  }

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are an expert election guide. Answer the following user query about voting realistically but concisely (under 100 words).\n\nUser: ${query}` }]
        }
      ],
      config: {
          systemInstruction: "You are CivicGuide, an expert on election processes."
      }
    });

    return response.text || "I'm sorry, I couldn't generate an answer at this time.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
