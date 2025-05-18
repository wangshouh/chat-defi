import { createConfig, http, type Config } from "wagmi";
import { base, bsc } from "wagmi/chains";

export const config: Config = createConfig({
  chains: [base, bsc],
  transports: {
    [bsc.id]: http(),
    [base.id]: http(),
  },
});
