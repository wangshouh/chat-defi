import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
});

export const DEFAULT_MODEL = openrouter("google/gemini-2.5-pro-preview");

export const FLASH_MODEL = openrouter("google/gemini-2.5-flash-preview");
