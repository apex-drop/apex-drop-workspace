import toast from "react-hot-toast";
import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import useSocketHandlers from "@/hooks/useSocketHandlers";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { cn, delay } from "@/lib/utils";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";

import CoinIcon from "../assets/images/coin.png?format=webp";
import EnergyIcon from "../assets/images/energy.png?format=webp";
import useTruecoin50SpinsBoost from "../hooks/useTruecoin50SpinsBoostMutation";
import useTruecoinLotteryMutation from "../hooks/useTruecoinLotteryMutation";

export default function TruecoinLottery() {
  const [data, setData] = useState(null);
  const spinMutation = useTruecoinLotteryMutation();
  const boostMutation = useTruecoin50SpinsBoost();

  const coins = data?.user?.coins || 0;
  const energy = data?.user?.currentSpins || 0;

  const [autoSpin, setAutoSpin] = useState(false);
  const [working, setWorking] = useState(false);

  /** Handle button click */
  const [handle50BoostClick, dispatchAndHandle50BoostClick] =
    useSocketDispatchCallback(
      /** Main */
      useCallback(() => {
        toast.promise(boostMutation.mutateAsync(), {
          loading: "Please wait",
          error: "Failed to Claim 50 Spins",
          success: "50 Spins Claimed",
        });
      }, []),

      /** Dispatch */
      useCallback((socket) => {
        socket.dispatch({
          action: "truecoin.50-boost",
        });
      }, [])
    );

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
          action: "truecoin.spin",
        });
      }, [])
    );

  /** Handlers */
  useSocketHandlers(
    useMemo(
      () => ({
        "truecoin.spin": () => {
          handleAutoSpinClick();
        },
        "truecoin.50-boost": () => {
          handle50BoostClick();
        },
      }),
      [handleAutoSpinClick, handle50BoostClick]
    )
  );

  useEffect(() => {
    if (!autoSpin || working) {
      return;
    }

    (async function () {
      // Lock Process
      setWorking(true);

      try {
        await spinMutation.mutateAsync(null).then((data) => {
          if (data.user.currentSpins < 1) {
            setAutoSpin(false);
          }
          setData(data);
        });
      } catch (e) {
        if (e?.response?.status === 400) {
          setAutoSpin(false);
        }
      }

      /** Delay */
      await delay(2_000);

      // Release Lock
      setWorking(false);
    })();
  }, [autoSpin, working]);

  return (
    <div className="flex flex-col gap-2 p-4">
      {/* Auto Spin Button */}
      <div className="flex gap-2">
        <button
          onClick={dispatchAndHandleAutoSpinClick}
          className={cn(
            "grow min-h-0 min-w-0 p-2 text-white rounded-lg disabled:opacity-50",
            autoSpin ? "bg-red-500" : "bg-purple-500",
            "font-bold"
          )}
        >
          {autoSpin ? "Stop" : "Start"}
        </button>

        {/* 50 Boost Click */}
        <button
          onClick={dispatchAndHandle50BoostClick}
          className={cn(
            "p-2 text-black rounded-lg disabled:opacity-50",
            "bg-purple-100",
            "font-bold",
            "shrink-0"
          )}
        >
          <HiOutlineArrowPath className="w-4 h-4" />
        </button>
      </div>

      {autoSpin ? <div className="text-center">Working....</div> : null}

      {data ? (
        <>
          <h3 className="text-2xl font-bold text-center text-orange-500">
            <img src={CoinIcon} className="inline w-5 h-5" />{" "}
            {Intl.NumberFormat().format(coins)}
          </h3>
          {energy > 0 ? (
            <h4 className="text-lg font-bold text-center text-purple-500">
              <img src={EnergyIcon} className="inline w-5" /> {energy}
            </h4>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
