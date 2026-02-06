
import { GoogleGenAI } from "@google/genai";

export const generateMatchMessage = async (profileName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${profileName}さんとマッチしました！相手が喜ぶような、明るくて少しワクワクするマッチングお祝いメッセージを日本語で1つ生成してください。最大20文字以内。`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text?.trim() || "新しいマッチングがあります！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `${profileName}さんとマッチしました！`;
  }
};
