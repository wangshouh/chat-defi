import { getDeFiProtocol } from "@/lib/dispatcher";
import { getAndDescribeMorphoMarkets } from "@/actions/morpho/supply";
import { Intent } from "@/lib/intentHandler";

export const protocolIntent: Intent = {
  name: "protocol",
  confidence: 0,
  handler: async (message: string) => {
    console.log("protocol: protocolIntent msg:", message);
    const action = await getDeFiProtocol(message);
    return action.describeActionsText;
  }
};

export const marketIntent: Intent = {
  name: "market",
  confidence: 0,
  handler: async (message: string) => {
    console.log("protocol: marketIntent msg:", message);
    const markets = await getAndDescribeMorphoMarkets();
    return markets;
}
};
