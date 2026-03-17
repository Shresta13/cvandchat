import { OpenAI } from "openai";

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing API key. Set GROQ_API_KEY (or OPENAI_API_KEY) in .env.local"
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}