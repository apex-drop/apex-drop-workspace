import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import useSocketHandlers from "@/hooks/useSocketHandlers";
import { cn, delay } from "@/lib/utils";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";

import usePumpadLotteryMutation from "../hooks/usePumpadLotteryMutation";
import usePumpadLotteryQuery from "../hooks/usePumpadLotteryQuery";

export default function PumpadLottery() {
  const query = usePumpadLotteryQuery();
  const drawCount = query.data?.["draw_count"] || 0;

  const spinMutation = usePumpadLotteryMutation();

  const [working, setWorking] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);

  /** Handle button click */
  const [handleAutoSpinClick, dispatchAndHandleAutoSpinClick] =
    useSocketDispatchCallback(
      /** Main */
      useCallback(() => {
        setAutoSpin((previous) => !previous);
        setWorking(false);
      }, [setAutoSpin, setWorking]),

      /** Dispatch */
      useCallback((socket) => {
        socket.dispatch({
          action: "pumpad.spin",
        });
      }, [])
    );

  /** Handlers */
  useSocketHandlers(
    useMemo(
      () => ({
        "pumpad.spin": () => {
          handleAutoSpinClick();
        },
      }),
      [handleAutoSpinClick]
    )
  );

  useEffect(() => {
    if (!autoSpin || working) {
      return;
    }

    if (!drawCount) {
      setAutoSpin(false);
      setWorking(false);
      return;
    }

    (async function () {
      // Lock Process
      setWorking(true);

      /** Spin */
      try {
        await spinMutation.mutateAsync();
      } catch {}

      /** Refetch Balance */
      try {
        await query.refetch();
      } catch {}

      /** Delay */
      await delay(1_000);

      // Release Lock
      setWorking(false);
    })();
  }, [autoSpin, drawCount, working]);

  return (
    <div className="p-4">
      {query.isPending ? (
        <div className="flex justify-center">Fetching Lottery...</div>
      ) : // Error
      query.isError ? (
        <div className="flex justify-center text-red-500">
          Failed to fetch lottery...
        </div>
      ) : (
        // Success
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-center">{drawCount}</h3>
          <p className="text-center text-neutral-500">Lottery</p>

          {/* Auto Spin Button */}
          <button
            disabled={!drawCount}
            onClick={dispatchAndHandleAutoSpinClick}
            className={cn(
              "p-2 text-black rounded-lg disabled:opacity-50",
              autoSpin ? "bg-red-500" : "bg-pumpad-green-500",
              "font-bold"
            )}
          >
            {autoSpin ? "Stop" : "Start"}
          </button>

          {autoSpin ? <div className="text-center">Working....</div> : null}
        </div>
      )}
    </div>
  );
}
