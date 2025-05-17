import { createOpenRouter } from "@ai-sdk/openrouter";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
