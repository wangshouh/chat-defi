import { MORPHO } from "@/lib/config";
import { FLASH_MODEL } from "@/lib/openrouter";
import { generateText } from "ai";
import { encodeFunctionData, parseUnits, type Address } from "viem";
import { morpho, morphoAbi } from "../../abi/morphoAbi";
import { USDC, USDCAbi } from "../../abi/USDCAbi";
import type { Call3 } from "../type";

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
  const model = FLASH_MODEL;
  const { text } = await generateText({
    model,
    prompt:
      `Use the following vault data from Morpho to provide users with several vaults to choose from to add assets.` +
      `Data: ${JSON.stringify(marketData)}`,
  });

  console.log(`AI >:\n ${text}`);
};

export const generateCalldata = async (
  uniqueKey: `0x${string}`,
  amount: string,
  walletAddress: Address
) => {
  const call3s = [] as Call3[];

  const depositAmount = parseUnits(amount, 6);
  const usdcAllowance = await USDC.read.allowance([walletAddress, MORPHO]);

  if (usdcAllowance < depositAmount) {
    const allowAction = encodeFunctionData({
      abi: USDCAbi,
      functionName: "approve",
      args: [MORPHO, depositAmount],
    });
    call3s[0] = {
      target: USDC.address,
      allowFailure: false,
      callData: allowAction,
    };
  }

  const marketParams = await morpho.read.idToMarketParams([uniqueKey]);

  const supplyAction = encodeFunctionData({
    abi: morphoAbi,
    functionName: "supply",
    args: [marketParams, depositAmount, 0n, walletAddress, "0x"],
  });

  call3s[1] = {
    target: morpho.address,
    allowFailure: false,
    callData: supplyAction,
  };

  return call3s;
};

export const calls = await generateCalldata(
  "0xdb0bc9f10a174f29a345c5f30a719933f71ccea7a2a75a632a281929bba1b535",
  "0.025",
  "0x66c27effe528cd25e110d5a5f59538eccd6e7728"
);

// const marketData = await getMorphoMarketByColletral();
// await describeMarket(marketData);
