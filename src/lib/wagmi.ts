import { createConfig, http, type Config } from "wagmi";
import { base } from "wagmi/chains";

export const config: Config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});
