import { generateObject } from "ai";

import { describeActions } from "@/actions/actionDescribe";
import { z } from "zod";
import { DEFAULT_MODEL } from "./openrouter";

export const getDeFiProtocol = async (input: string) => {
  const { object: actions } = await generateObject({
    model: DEFAULT_MODEL,
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

  const describeActionsText = await describeActions(actions.actions);

  return { actions, describeActionsText };
};

// console.log(
//   await getDeFiProtocol("我希望使用 ETH 向 Morpho 协议中的金库提供 USDC 资产")
// );
