import { generateObject, generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "bun";
import { z } from "zod";
import type { Address } from "viem";

const openrouter = createOpenRouter({
  apiKey: env.OPEN_ROUTER_KEY,
});

export interface Item {
  uniqueKey: string;
  monthlyApys: MonthlyApys;
  collateralAsset: CollateralAsset;
}

export interface MonthlyApys {
  netSupplyApy: number;
}

export interface CollateralAsset {
  address: string;
  name: string;
  tags?: string[];
}

export const getMorphoMarketByColletral = async () => {
  const request = await fetch("https://blue-api.morpho.org/graphql", {
    headers: {
      "content-type": "application/json",
    },
    body: '{"query":"query ExampleQuery {\\n  markets(\\n    first: 10\\n    orderBy: TotalLiquidityUsd\\n    where: {\\n      apyAtTarget_gte: 0.01\\n      chainId_in: [8453]\\n      loanAssetAddress_in: [\\"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\\"],\\n    }\\n  ) {\\n    items {\\n      uniqueKey\\n      monthlyApys {\\n        netSupplyApy\\n      }\\n      collateralAsset {\\n        address\\n        name\\n        tags\\n      }\\n    }\\n  }\\n}\\n","variables":{"marketId":null,"first":10,"where":null},"operationName":"ExampleQuery"}',
    method: "POST",
  });
  const data = await request.json();

  return data["data"]["markets"]["items"] as Item[];
};

export const describeMarket = async (marketData: Item[]) => {
  const model = openrouter("google/gemini-2.5-flash-preview");
  const { text } = await generateText({
    model,
    prompt:
      `Use the following vault data from Morpho to provide users with several vaults to choose from to add assets.` +
      `Data: ${JSON.stringify(marketData)}`,
  });

  console.log(`AI >:\n ${text}`);
};

// const marketData = await getMorphoMarketByColletral();
// await describeMarket(marketData);
