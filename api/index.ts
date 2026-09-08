import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { CHARACTERS } from "../src/config/characters.js";
import { FACE_SWAP_PROMPT } from "../src/config/prompt.js";

dotenv.config();

type DataImage = { mimeType: string; data: string };
function parseDataUrl(value: unknown): DataImage | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^data:([^;]+);base64,(.+)$/s);
  if (match) return { mimeType: match[1], data: match[2].trim() };
  return /^[A-Za-z0-9+/=]+$/.test(value.trim()) ? { mimeType: "image/jpeg", data: value.trim() } : null;
}
function mimeFor(file: string) {
  return file.toLowerCase().endsWith(".jpg") || file.toLowerCase().endsWith(".jpeg") ? "image/jpeg" : "image/png";
}

const app = express();
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", hasApiKey: !!process.env.GEMINI_API_KEY, campaign: "YLY 51 Luxor - Comedy AI Face Swap" }));
app.get("/api/characters", (_req, res) => res.json({ characters: CHARACTERS.map((char) => ({ ...char, available: fs.existsSync(path.join(process.cwd(), "public", char.image.replace(/^\//, ""))) })) }));

app.post("/api/face-swap", async (req, res) => {
  try {
    const { userImage, selectedCharacterId } = req.body ?? {};
    const user = parseDataUrl(userImage);
    const character = CHARACTERS.find((item) => item.id === selectedCharacterId);
    if (!user || user.data.length < 100) return res.status(400).json({ success: false, error: "الصورة مش واضحة كفاية، جرّب صورة تانية." });
    if (!character) return res.status(400).json({ success: false, error: "الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂" });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ success: false, error: "مفتاح Gemini غير مضاف في إعدادات Vercel." });
    const file = path.join(process.cwd(), "public", character.image.replace(/^\//, ""));
    if (!fs.existsSync(file)) return res.status(400).json({ success: false, error: "الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂" });
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
    const base = { inlineData: { mimeType: mimeFor(file), data: fs.readFileSync(file).toString("base64") } };
    const identity = { inlineData: { mimeType: user.mimeType, data: user.data } };
    let response;
    try {
      response = await ai.models.generateContent({ model: "gemini-3.1-flash-image", contents: { parts: [base, identity, { text: FACE_SWAP_PROMPT }] } });
    } catch {
      response = await ai.models.generateContent({ model: "gemini-3.1-flash-lite-image", contents: { parts: [base, identity, { text: FACE_SWAP_PROMPT }] } });
    }
    const part = response.candidates?.[0]?.content?.parts?.find((item: any) => item.inlineData?.data);
    if (!part?.inlineData?.data) return res.status(500).json({ success: false, error: "حصلت مشكلة بسيطة، جرّب تاني 😂" });
    return res.json({ success: true, resultImage: `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`, characterName: character.name, characterMovie: character.movie });
  } catch (error) {
    console.error("[Vercel FaceSwap Error]", error);
    return res.status(500).json({ success: false, error: "حصلت مشكلة بسيطة، جرّب تاني 😂" });
  }
});

export default app;
