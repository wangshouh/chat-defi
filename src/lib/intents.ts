import { getDeFiProtocol } from "@/lib/dispatcher";
import { getAndDescribeMorphoMarkets, Item } from "@/actions/morpho/supply";
import { Intent } from "@/lib/intentHandler";

export interface MarketIntent {
  data: any;
  describe: string;
}

export const protocolIntent: Intent<MarketIntent> = {
  name: "protocol",
  confidence: 0,
  handler: async (message: string) => {
    console.log("protocol: protocolIntent msg:", message);
    const action = await getDeFiProtocol(message);
    return {data: action.actions, describe: action.describeActionsText};
  }
};


export const marketIntent: Intent<MarketIntent> = {
  name: "market",
  confidence: 0,
  handler: async (message: string) => {
    console.log("protocol: marketIntent msg:", message);
    const markets = await getAndDescribeMorphoMarkets();
    return {data: markets.items, describe: markets.describe};
}
};
