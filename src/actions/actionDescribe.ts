import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { env } from "bun";

const openrouter = createOpenRouter({
  apiKey: env.OPEN_ROUTER_KEY,
});

const describeActions = async (actions: string[]) => {
  const generateModel = openrouter("google/gemini-2.5-flash-preview");

  const { text } = await generateText({
    model: generateModel,
    prompt:
      `The following array represents a series of DeFi operations. Please explain the specific meaning of these operations to users: \n` +
      `Actions: [${actions}]`,
  });

  return text;
};

console.log(await describeActions(["1inch::swap", "morpho::supply"]));
