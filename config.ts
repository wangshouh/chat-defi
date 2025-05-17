import { env } from "bun";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(env.BASE_RPC_URL),
});

const account = privateKeyToAccount(env.PRIVATE_KEY as Hex);
export const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(env.BASE_RPC_URL),
});

export const MORPHO = "0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb" as Address;

// walletClient.writeContract({
//   address: 0x66C27eFfE528cD25e110D5A5F59538ecCD6E7728,
//   abi: accountAbi,
//   functionName: "aggregate3",
//   args: []
// })
