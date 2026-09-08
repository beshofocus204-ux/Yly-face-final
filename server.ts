import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { CHARACTERS } from "./src/config/characters.js";
import { FACE_SWAP_PROMPT } from "./src/config/prompt.js";

// Load environment variables (.env.local, .env)
dotenv.config({ path: ".env.local" });
dotenv.config();

const PORT = 3000;
export const app = express();

// Increase JSON payload limit for high-res uploaded user photos
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Helper to determine mime type from extension
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".png":
    default:
      return "image/png";
  }
}

// Helper to parse base64 data URL
function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (match) {
    return { mimeType: match[1], data: match[2].trim() };
  }
  // Raw base64 string
  if (/^[A-Za-z0-9+/=]+$/.test(dataUrl.trim())) {
    return { mimeType: "image/jpeg", data: dataUrl.trim() };
  }
  return null;
}

// 1. Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    campaign: "YLY 51 Luxor - Comedy AI Face Swap",
  });
});

// 2. Characters status endpoint
// Checks actual local file existence on disk for each character
app.get("/api/characters", (_req, res) => {
  const charactersWithStatus = CHARACTERS.map((char) => {
    const relativePath = char.image.startsWith("/") ? char.image.slice(1) : char.image;
    const fullPath = path.join(process.cwd(), "public", relativePath);
    const exists = fs.existsSync(fullPath);
    return {
      ...char,
      available: exists,
    };
  });

  res.json({ characters: charactersWithStatus });
});

// 3. Admin / Organizer upload endpoint
// Enables organizers to upload or replace official character PNGs or logos directly
app.post("/api/admin/upload-asset", async (req, res) => {
  try {
    const { targetPath, imageBase64 } = req.body;
    if (!targetPath || !imageBase64) {
      return res.status(400).json({ error: "Missing targetPath or imageBase64" });
    }

    // Safety: strictly allow only public/assets subdirectories
    const normalized = path.normalize(targetPath).replace(/^(\.\.[\/\\])+/, "");
    if (!normalized.startsWith("assets/")) {
      return res.status(403).json({ error: "Invalid asset path" });
    }

    const fullPath = path.join(process.cwd(), "public", normalized);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const parsed = parseDataUrl(imageBase64);
    if (!parsed) {
      return res.status(400).json({ error: "Invalid image data" });
    }

    const buffer = Buffer.from(parsed.data, "base64");
    await fs.promises.writeFile(fullPath, buffer);

    console.log(`[Admin] Successfully updated asset: ${fullPath} (${buffer.length} bytes)`);
    res.json({ success: true, path: `/${normalized}` });
  } catch (err) {
    console.error("[Admin] Error uploading asset:", err);
    res.status(500).json({ error: "Failed to upload asset" });
  }
});

// 4. Gemini Face Swap endpoint
// Strictly enforces:
// IMAGE 1 = EXACT SELECTED CHARACTER IMAGE / BASE IMAGE
// IMAGE 2 = USER UPLOADED PHOTO / IDENTITY REFERENCE
app.post("/api/face-swap", async (req, res) => {
  try {
    const { userImage, selectedCharacterId } = req.body;

    // --- HARD VALIDATION CHECK 1: User Image ---
    if (!userImage || typeof userImage !== "string") {
      console.warn("[FaceSwap Validation Failed] User image is missing or invalid");
      return res.status(400).json({
        success: false,
        error: "الصورة مش واضحة كفاية، جرّب صورة تانية.",
      });
    }

    const parsedUserImage = parseDataUrl(userImage);
    if (!parsedUserImage || !parsedUserImage.data || parsedUserImage.data.length < 100) {
      console.warn("[FaceSwap Validation Failed] User image data is corrupted or too small");
      return res.status(400).json({
        success: false,
        error: "الصورة مش واضحة كفاية، جرّب صورة تانية.",
      });
    }

    // --- HARD VALIDATION CHECK 2: Selected Character ID ---
    if (!selectedCharacterId || typeof selectedCharacterId !== "string") {
      console.warn("[FaceSwap Validation Failed] selectedCharacterId is missing");
      return res.status(400).json({
        success: false,
        error: "الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂",
      });
    }

    // Resolve through the trusted centralized character configuration
    const character = CHARACTERS.find((c) => c.id === selectedCharacterId);
    if (!character) {
      console.warn(`[FaceSwap Validation Failed] Character ID '${selectedCharacterId}' not in configuration`);
      return res.status(400).json({
        success: false,
        error: "الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂",
      });
    }

    // --- HARD VALIDATION CHECK 3: Character Asset on Disk ---
    const relativeImagePath = character.image.startsWith("/") ? character.image.slice(1) : character.image;
    const characterFullPath = path.join(process.cwd(), "public", relativeImagePath);

    if (!fs.existsSync(characterFullPath)) {
      console.warn(`[FaceSwap Validation Failed] Character asset file not found on disk: ${characterFullPath}`);
      return res.status(400).json({
        success: false,
        error: "الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂",
      });
    }

    // --- HARD VALIDATION CHECK 4: Load exact character file bytes ---
    let characterBuffer: Buffer;
    try {
      characterBuffer = await fs.promises.readFile(characterFullPath);
    } catch (readErr) {
      console.error(`[FaceSwap Error] Failed to read character asset from disk:`, readErr);
      return res.status(400).json({
        success: false,
        error: "الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂",
      });
    }

    if (characterBuffer.length === 0) {
      console.warn(`[FaceSwap Validation Failed] Character asset file is empty: ${characterFullPath}`);
      return res.status(400).json({
        success: false,
        error: "الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂",
      });
    }

    const characterMimeType = getMimeType(characterFullPath);
    const characterBase64 = characterBuffer.toString("base64");

    // Check Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[FaceSwap Error] GEMINI_API_KEY environment variable is not configured on the server.");
      return res.status(500).json({
        success: false,
        error: "حصلت مشكلة بسيطة، جرّب تاني 😂",
      });
    }

    // Initialize the official GoogleGenAI SDK with required telemetry header
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // =========================================================================
    // CRITICAL IMAGE ORDER MANDATE:
    // IMAGE 1 = EXACT SELECTED CHARACTER IMAGE / BASE IMAGE
    // IMAGE 2 = USER UPLOADED PHOTO / IDENTITY REFERENCE
    // =========================================================================
    const image1Part = {
      inlineData: {
        mimeType: characterMimeType,
        data: characterBase64,
      },
    };

    const image2Part = {
      inlineData: {
        mimeType: parsedUserImage.mimeType,
        data: parsedUserImage.data,
      },
    };

    const promptTextPart = {
      text: FACE_SWAP_PROMPT,
    };

    console.log(`[FaceSwap] Invoking Gemini API for character '${character.name}' (${character.id})...`);
    console.log(`[FaceSwap] Image 1: ${characterFullPath} (${characterMimeType}, ${characterBase64.length} chars)`);
    console.log(`[FaceSwap] Image 2: User Photo (${parsedUserImage.mimeType}, ${parsedUserImage.data.length} chars)`);

    // Call Gemini with the recommended multimodal image editing model
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [
            image1Part,     // IMAGE 1 = EXACT SELECTED CHARACTER
            image2Part,     // IMAGE 2 = USER PHOTO
            promptTextPart, // FACE_SWAP_PROMPT
          ],
        },
      });
    } catch (modelErr: any) {
      console.warn("[FaceSwap] Attempt with gemini-3.1-flash-image failed, trying gemini-3.1-flash-lite-image...", modelErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [
            image1Part,
            image2Part,
            promptTextPart,
          ],
        },
      });
    }

    // Extract the generated image from response candidates
    let resultImage: string | null = null;
    const candidates = response?.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          resultImage = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultImage) {
      console.warn("[FaceSwap Error] Model responded without image data in parts.");
      return res.status(500).json({
        success: false,
        error: "حصلت مشكلة بسيطة، جرّب تاني 😂",
      });
    }

    console.log(`[FaceSwap Success] Generated image returned successfully for '${character.name}'!`);

    return res.json({
      success: true,
      resultImage: resultImage,
      characterName: character.name,
      characterMovie: character.movie,
    });
  } catch (err: any) {
    console.error("[FaceSwap Unhandled Error]:", err);
    return res.status(500).json({
      success: false,
      error: "حصلت مشكلة بسيطة، جرّب تاني 😂",
    });
  }
});

// Vite Middleware & Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[YLY Luxor App] Server running on http://0.0.0.0:${PORT}`);
  });
}

// Vercel imports this module as a serverless function, so it must not call
// app.listen(). Local/Replit development still starts the normal HTTP server.
if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
