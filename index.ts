import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, generateObject } from "ai";
import { env } from "bun";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: env.OPEN_ROUTER_KEY,
});

const getDeFiProtocol = async (input: string) => {
  const model = openrouter("google/gemini-2.5-pro-preview");

  const { object: actions } = await generateObject({
    model,
    schema: z.object({
      actions: z
        .enum([
          "morpho::supply",
          "morpho::withdraw",
          "morpho::repay",
          "morpho::falshloan",
          "aave::supply",
          "aave::withdraw",
          "1inch::swap",
        ])
        .array(),
    }),
    prompt: `Evaluate the actions required to execute the transaction requested by the user and output them in order: ${input}`,
  });

  // actions.actions.map((action) => {
  //   switch (action) {
  //     case "morpho::repay": {
  //       const { object: actions } = await generateObject({
  //         model,
  //         schema: z.object({

  //         }),
  //         prompt: `Evaluate the actions required to execute the transaction requested by the user and output them in order: ${input}`,
  //       });
  //     }
  //   }
  // });
  return { actions };
};

console.log(
  await getDeFiProtocol("我希望使用 ETH 向 Morpho 协议中的金库提供 USDC 资产"),
);
