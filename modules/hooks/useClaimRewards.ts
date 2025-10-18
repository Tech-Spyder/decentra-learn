import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { supabase } from "@/lib/superbaseClient";
import { getRewardContract } from "@/lib/contract";
import { ethers } from "ethers";
import { useToast } from "@/modules/app/hooks/useToast";

export interface RewardClaimedEvent {
  user: string;
  courseId: string;
  xpAmount: string;
  signatureHash: string;
}

export interface TransactionReceipt {
  hash: string;
  logs: Array<{
    topics: string[];
    data: string;
  }>;
}

export interface ErrorWithCode extends Error {
  code?: number | string;
}

const parseRewardClaimedEvent = (
  receipt: TransactionReceipt
): RewardClaimedEvent | null => {
  try {
    const iface = new ethers.Interface([
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "courseId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "xpAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bytes32",
            name: "signatureHash",
            type: "bytes32",
          },
        ],
        name: "RewardClaimed",
        type: "event",
      },
    ]);

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({
          topics: log.topics,
          data: log.data,
        });

        if (parsed && parsed.name === "RewardClaimed") {
          return {
            user: parsed.args.user as string,
            courseId: parsed.args.courseId.toString(),
            xpAmount: parsed.args.xpAmount.toString(),
            signatureHash: parsed.args.signatureHash as string,
          };
        }
      } catch (e) {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing event:", error);
    return null;
  }
};

interface UseClaimRewardsReturn {
  isClaiming: boolean;
  claimRewards: (courseId: string) => Promise<boolean>;
}

export function useClaimRewards(): UseClaimRewardsReturn {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const toast = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  const claimRewards = async (courseId: string): Promise<boolean> => {
    if (!user || wallets.length === 0) {
      toast.error("Please connect your wallet!", { duration: 3000 });
      return false;
    }

    setIsClaiming(true);
    const toastId = `claim-${Date.now()}`;

    try {
      const wallet = wallets[0];

      

      toast.loading("Switching to CrossFi network...", {
        id: toastId,
        duration: Infinity,
      });
      await wallet.switchChain(4158);

      toast.loading("Initializing contract...", {
        id: toastId,
        duration: Infinity,
      });
      const provider = await wallet.getEthereumProvider();
      const contract = await getRewardContract(provider);

      toast.loading("Generating proof of completion...", {
        id: toastId,
        duration: Infinity,
      });
      const { data: signatureResponse, error: signatureError } =
        await supabase.functions.invoke("generate-reward-signature", {
          body: { courseId, userId: user.id },
        });

      if (signatureError || !signatureResponse?.success) {
        throw new Error(
          signatureResponse?.error ||
            signatureError?.message ||
            "Failed to get signature"
        );
      }

      const { signature, contractCourseId, xpAmount, walletAddress } =
        signatureResponse.data;
      let { deadline } = signatureResponse.data;
      deadline = Number(deadline);
      if (!deadline || isNaN(deadline) || deadline <= 0) {
        throw new Error("Invalid deadline. Please try again.");
      }

      if (walletAddress.toLowerCase() !== wallet.address.toLowerCase()) {
        throw new Error(
          "Wallet address mismatch. Please reconnect your wallet."
        );
      }

      const now = Math.floor(Date.now() / 1000);
      if (now > deadline) {
        throw new Error("Signature expired. Please try again.");
      }

      toast.loading("Please confirm transaction in your wallet...", {
        id: toastId,
        duration: Infinity,
      });

      const tx = await contract.claimReward(
        contractCourseId,
        xpAmount,
        deadline,
        signature,
        {
          value: ethers.parseEther("0.0001"),
          gasLimit: 300000,
        }
      );

      toast.loading("Transaction submitted! Confirming on blockchain...", {
        id: toastId,
        duration: Infinity,
      });

      const receipt = await tx.wait();

      let claimedXP = xpAmount;
      const eventData = parseRewardClaimedEvent(receipt);
      if (eventData) {
        claimedXP = eventData.xpAmount;
      }

      const { data: verifyResponse, error: verifyError } =
        await supabase.functions.invoke("verify-reward-claim", {
          body: {
            transactionHash: receipt.hash,
            userId: user.id,
            courseId,
          },
        });

      if (verifyError || !verifyResponse?.success) {
        console.error(
          "Backend verification failed:",
          verifyError || verifyResponse?.error
        );
        toast.warning(
          "Reward claimed on blockchain, but DB sync failed. Contact support if issues persist.",
          { duration: 5000 }
        );
      } else {
        console.log("Backend verified successfully!");
      }

      toast.success(`🎉 ${claimedXP} XP Successfully Claimed!`, {
        id: toastId,
        duration: 5000,
      });

      return true;
    } catch (error) {
      console.error("Claim failed:", error);

      const err = error as ErrorWithCode;
      let message = "Failed to claim rewards";

      if (err.message?.includes("expired")) {
        message = "⏰ Signature expired. Please try again.";
      } else if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        message = "❌ Transaction cancelled";
      } else if (err.message?.includes("insufficient funds")) {
        message = "💰 Insufficient XFI for gas fees";
      } else if (err.message?.includes("AlreadyClaimed")) {
        message = "✅ You've already claimed this reward!";
      } else if (err.message?.includes("SignatureAlreadyUsed")) {
        message = "🔄 Signature already used. Please request a new one.";
      } else if (err.message?.includes("InvalidSignature")) {
        message = "❌ Invalid signature. Please try again.";
      } else if (err.message?.includes("Wallet address mismatch")) {
        message = "👛 " + err.message;
      } else if (
        err.message?.includes("user rejected") ||
        err.message?.includes("User denied")
      ) {
        message = "❌ Transaction rejected";
      } else if (err.message) {
        message = err.message;
      }

      toast.error(message, { duration: 5000 });
      return false;
    } finally {
      setIsClaiming(false);
    }
  };

  return { isClaiming, claimRewards };
}