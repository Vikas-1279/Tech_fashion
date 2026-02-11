
import { GoogleGenAI, Type } from "@google/genai";
import { StyleInputs, OutfitSuggestion } from "../types";

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) || "";

export const generateOutfitSuggestion = async (inputs: StyleInputs, uploadedImage?: string): Promise<OutfitSuggestion> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `You are a world-class fashion critic and stylist for 'Tech_Fashion'. 
  Your primary role is to ensure the user's outfit is PERFECT for the occasion, travel purpose, and setting.
  
  STRICT RULES:
  1. If an image is uploaded and it does NOT match the selected Occasion or Travel Purpose (e.g., Beachwear for Business Travel), you MUST set suitabilityStatus to 'Inappropriate' and explain why clearly.
  2. If the setting is 'Outdoor' and the occasion is 'Partywear', advise the user on comfort (e.g., if the outfit is too heavy or the fabric is wrong for the weather).
  3. Provide a 'suitabilityFeedback' that directly addresses the uploaded piece vs the occasion and travel context.
  4. Suggest complementary items for any uploaded piece.`;

  const prompt = `
    Analyze this request:
    - User Identity: ${inputs.gender}
    - Occasion: ${inputs.occasion}
    - Travel Purpose: ${inputs.travelPurpose}
    - Aesthetic: ${inputs.outfitInspiration}
    - Skin Tone: ${inputs.skinTone}
    - Weather: ${inputs.climate}
    - Outfit Area (Setting): ${inputs.setting} (Indoor/Outdoor)
    - Specific User Inquiry: "${inputs.userRequest || 'None'}"
    
    ${uploadedImage ? "IMAGE ATTACHED: Use the item in this photo as the core piece." : "No image: Suggest a full look from scratch."}
    
    Respond in JSON format.
  `;

  const parts: any[] = [{ text: prompt }];
  if (uploadedImage) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: uploadedImage.split(',')[1],
      },
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          top: { type: Type.STRING },
          bottom: { type: Type.STRING },
          footwear: { type: Type.STRING },
          accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          matchingAdvice: { type: Type.STRING },
          suitabilityStatus: { 
            type: Type.STRING, 
            enum: ['Perfect Match', 'Inappropriate', 'Style Mismatch'] 
          },
          suitabilityFeedback: { type: Type.STRING, description: "Detailed feedback on if the item fits the occasion" },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["top", "bottom", "footwear", "accessories", "explanation", "colorPalette", "suitabilityStatus", "suitabilityFeedback"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as OutfitSuggestion;
};

export const generateMoodboardImage = async (suggestion: OutfitSuggestion, inputs: StyleInputs): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const imagePrompt = `Full body fashion photography of a ${inputs.gender} wearing ${suggestion.top} and ${suggestion.bottom}. ${inputs.outfitInspiration} style, ${inputs.occasion} vibe, travel purpose ${inputs.travelPurpose}, ${inputs.setting} area, cinematic lighting, 8k resolution.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: imagePrompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return undefined;
};
