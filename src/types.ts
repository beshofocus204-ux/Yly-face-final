import { Character } from "./config/characters";

export type Step = "landing" | "upload" | "select" | "loading" | "result";

export interface CharacterWithStatus extends Character {
  available: boolean;
}

export interface FaceSwapRequest {
  userImage: string; // Base64 data URL
  selectedCharacterId: string;
}

export interface FaceSwapResponse {
  success: boolean;
  resultImage?: string;
  characterName?: string;
  error?: string;
}
