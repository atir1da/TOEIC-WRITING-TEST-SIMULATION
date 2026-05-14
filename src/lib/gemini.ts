import { GoogleGenAI, Type } from "@google/genai";
import { AIResult } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "Score from 0 to 5" },
    grammarFeedback: { type: Type.STRING, description: "Feedback about grammar" },
    vocabularyFeedback: { type: Type.STRING, description: "Feedback about vocabulary" },
    generalFeedback: { type: Type.STRING, description: "Overall strategic feedback in markdown" }
  },
  required: ["score", "grammarFeedback", "vocabularyFeedback", "generalFeedback"]
};

export async function getFeedback(taskType: string, prompt: string, userInput: string, imageUrl?: string): Promise<AIResult> {
  const modelName = "gemini-3-flash-preview";
  
  let systemInstruction = "";
  if (taskType === "PART1") {
    systemInstruction = "You are a TOEIC Writing evaluator. Evaluate Part 1 (Write a sentence based on a picture). Criteria: Grammar and relevance to the photo (words provided).";
  } else if (taskType === "PART2") {
    systemInstruction = "You are a TOEIC Writing evaluator. Evaluate Part 2 (Respond to a written request). Criteria: Vocabulary, sentence variety, and organization.";
  } else if (taskType === "PART3") {
    systemInstruction = "You are a TOEIC Writing evaluator. Evaluate Part 3 (Write an opinion essay). Criteria: Clarity of argument, supporting examples, grammar, and overall structure.";
  }

  const promptContent = `
    Prompt/Question context: ${prompt}
    User Input: ${userInput}
    ${imageUrl ? `(Image context described in prompt above)` : ''}
    
    Evaluate the response and provide score (0-5) and feedback on grammar, vocabulary, and overall quality.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: promptContent }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
        temperature: 0.2,
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as AIResult;
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    return {
      score: 0,
      grammarFeedback: "Failed to evaluate grammar.",
      vocabularyFeedback: "Failed to evaluate vocabulary.",
      generalFeedback: "Evaluation system timeout or error. Please check your internet connection and try again."
    };
  }
}
