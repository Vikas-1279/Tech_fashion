
export type Gender = 'Male' | 'Female' | 'Unisex';

export interface StyleInputs {
  gender: Gender;
  occasion: string;
  travelPurpose: string;
  outfitInspiration: string;
  skinTone: string;
  climate: string;
  location: string;
  setting: 'Indoor' | 'Outdoor';
  userRequest?: string;
}

export interface OutfitSuggestion {
  top: string;
  bottom: string;
  footwear: string;
  accessories: string[];
  explanation: string;
  colorPalette: string[];
  matchingAdvice?: string;
  suitabilityStatus: 'Perfect Match' | 'Inappropriate' | 'Style Mismatch';
  suitabilityFeedback: string;
}

export interface GenerationResult {
  suggestion: OutfitSuggestion;
  moodboardUrl?: string;
}
