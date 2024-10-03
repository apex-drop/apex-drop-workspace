import { CgSpinner } from "react-icons/cg";
import useTomarketClaimTaskMutation from "../hooks/useTomarketClaimTaskMutation";
import useTomarketHiddenTaskQuery from "../hooks/useTomarketHiddenTaskQuery";
import toast from "react-hot-toast";
import useTomarketBalanceQuery from "../hooks/useTomarketBalanceQuery";
import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import { useCallback, useMemo } from "react";
import useSocketHandlers from "@/hooks/useSocketHandlers";

export default function TomarketDailyCombo() {
  const balanceQuery = useTomarketBalanceQuery();
  const hiddenTaskQuery = useTomarketHiddenTaskQuery();
  const claimMutation = useTomarketClaimTaskMutation();

  const hiddenTask = hiddenTaskQuery.data?.[0];

  const [claimDailyReward, dispatchAndClaimDailyReward] =
    useSocketDispatchCallback(
      /** Main */
      useCallback(() => {
        if (!hiddenTask || hiddenTask.status !== 0) return;
        toast
          .promise(claimMutation.mutateAsync(hiddenTask.taskId), {
            loading: "Claiming...",
            error: "Failed to Claim...",
            success: "Claimed Successfully...",
          })
          .then(() => {
            balanceQuery.refetch();
            hiddenTaskQuery.refetch();
          });
      }, [hiddenTask]),

      /** Dispatch */
      useCallback((socket) => {
        socket.dispatch({
          action: "tomarket.hidden-task-claim",
        });
      }, [])
    );

  /** Handlers */
  useSocketHandlers(
    useMemo(
      () => ({
        "tomarket.hidden-task-claim": () => {
          claimDailyReward();
        },
      }),
      [claimDailyReward]
    )
  );

  return hiddenTaskQuery.isPending ? (
    <CgSpinner className="w-5 h-5 mx-auto my-2 animate-spin" />
  ) : hiddenTask && hiddenTask.status === 0 ? (
    <button
      onClick={dispatchAndClaimDailyReward}
      className="px-4 py-2 my-2 text-white rounded-full bg-rose-500"
    >
      Claim Daily Combo
    </button>
  ) : null;
}
