import { FLASH_MODEL } from "@/lib/openrouter";
import { generateText } from "ai";

export const describeActions = async (actions: string[]) => {
  const { text } = await generateText({
    model: FLASH_MODEL,
    prompt:
      `The following array represents a series of DeFi operations. Please explain the specific meaning of these operations to users: \n` +
      `Actions: [${actions}]`,
  });

  return text;
};

// console.log(await describeActions(["1inch::swap", "morpho::supply"]));
