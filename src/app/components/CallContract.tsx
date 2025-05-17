import { accountAbi } from "@/abi/accountAbi";
import type { Call3 } from "@/actions/type";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";

interface CallContractProps {
  call3data: Call3[];
}

export default function CallContract({ call3data }: CallContractProps) {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const callContract = useCallback(() => {
    if (!isConnected || !address) {
      return;
    }

    writeContract({
      address,
      abi: accountAbi,
      functionName: "aggregate3",
      args: [call3data as any],
    });
  }, [address, writeContract, call3data]);

  return (
    <Button
      className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-md max-w-4xl mx-auto mt-2"
      onClick={callContract}
    >
      Call Contract
    </Button>
  );
}
