import { GoogleGenAI, Type } from "@google/genai";
import { Classification } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const classificationSchema = {
    type: Type.OBJECT,
    properties: {
        classification: {
            type: Type.STRING,
            description: "A classificação da glicemia.",
            enum: ['HIPOGLICEMIA', 'NORMAL', 'HIPERGLICEMIA']
        }
    },
    required: ['classification']
};

// Fallback function in case the API fails or returns an unexpected value
const classifyLocally = (value: number): Classification => {
    if (value <= 70) return Classification.HYPOGLYCEMIA;
    if (value <= 150) return Classification.NORMAL;
    return Classification.HYPERGLYCEMIA;
};

export const classifyGlucose = async (value: number): Promise<Classification> => {
    const prompt = `Classifique o seguinte nível de glicemia: ${value} mg/dL. Use estes critérios: até 70 é 'HIPOGLICEMIA', de 71 a 150 é 'NORMAL', e acima de 150 é 'HIPERGLICEMIA'.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: classificationSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        const classificationValue = result.classification?.toUpperCase().trim();

        switch (classificationValue) {
            case Classification.HYPOGLYCEMIA:
                return Classification.HYPOGLYCEMIA;
            case Classification.NORMAL:
                return Classification.NORMAL;
            case Classification.HYPERGLYCEMIA:
                return Classification.HYPERGLYCEMIA;
            default:
                // If Gemini returns an unexpected value, use the local fallback for safety.
                console.warn("Gemini returned an unknown classification, using local fallback:", result.classification);
                return classifyLocally(value);
        }

    } catch (error) {
        console.error("Error calling Gemini API, using local fallback:", error);
        // Fallback to local classification if API call itself fails
        return classifyLocally(value);
    }
};
