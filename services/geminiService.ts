import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Example function to analyze a new topic suggestion
export const analyzeTopicSuggestion = async (suggestion: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview',
            contents: `Analyze this prediction topic suggestion for high school students: "${suggestion}". 
            Is it appropriate? Does it have a clear outcome? Suggest a title and category.`,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API Error", error);
        return null;
    }
};