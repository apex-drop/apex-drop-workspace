import Countdown from "react-countdown";
import { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";

import TomarketButton from "./TomarketButton";
import TomarketInput from "./TomarketInput";
import useTomarketBalanceQuery from "../hooks/useTomarketBalanceQuery";
import useTomarketClaimGameMutation from "../hooks/useTomarketClaimGameMutation";
import useTomarketStartGameMutation from "../hooks/useTomarketStartGameMutation";
import { CgSpinner } from "react-icons/cg";
import { delay } from "@/lib/utils";
import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import useSocketHandlers from "@/hooks/useSocketHandlers";
import useSocketState from "@/hooks/useSocketState";

const GAME_DURATION = 30_000;
const EXTRA_DELAY = 3_000;
const MIN_POINT = 100;
const INITIAL_POINT = 220;
const MAX_POINT = 390;

export default function Tomarket() {
  const query = useTomarketBalanceQuery();

  const [tomarket, setTomarket] = useState(null);

  const [working, setWorking] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [desiredPoint, setDesiredPoint, dispatchAndSetDesiredPoint] =
    useSocketState("tomarket.game.desired-point", INITIAL_POINT);

  const tickets = query.data?.["play_passes"] || 0;
  const points = useMemo(
    () => Math.max(MIN_POINT, Math.min(MAX_POINT, desiredPoint)),
    [desiredPoint]
  );

  const startGameMutation = useTomarketStartGameMutation(tomarket?.drop);
  const claimGameMutation = useTomarketClaimGameMutation(
    tomarket?.drop,
    points
  );

  /** Countdown renderer */
  const countdownRenderer = ({ seconds }) => (
    <span className="text-xl font-bold">{seconds}</span>
  );

  /** Configure Tomarket */
  const configureTomarket = useCallback(
    (data, store = true) => {
      if (store) {
        chrome?.storage?.local.set({
          tomarket: data,
        });
      }
      setTomarket(data);
    },
    [setTomarket]
  );

  /** Handle button click */
  const [handleAutoPlayClick, dispatchAndHandleAutoPlayClick] =
    useSocketDispatchCallback(
      /** Main */
      useCallback(() => {
        setDesiredPoint(points);
        setAutoPlaying((previous) => !previous);
        setWorking(false);
      }, [points, setDesiredPoint, setAutoPlaying, setWorking]),

      /** Dispatch */
      useCallback((socket) => {
        socket.dispatch({
          action: "tomarket.autoplay",
        });
      }, [])
    );

  /** Handlers */
  useSocketHandlers(
    useMemo(
      () => ({
        "tomarket.autoplay": () => {
          handleAutoPlayClick();
        },
      }),
      [handleAutoPlayClick]
    )
  );

  useEffect(() => {
    const watchStorage = ({ tomarket: data }) => {
      if (data) {
        configureTomarket(data.newValue, false);
      }
    };

    /** Get and Store Data */
    chrome?.storage?.local.get("tomarket").then(({ tomarket: data }) => {
      if (data) {
        configureTomarket(data, false);
      }
    });

    /** Listen for change */
    chrome?.storage?.local?.onChanged.addListener(watchStorage);

    return () => {
      /** Remove Listener */
      chrome?.storage?.local?.onChanged.removeListener(watchStorage);
    };
  }, []);

  /** Auto Play */
  useEffect(() => {
    if (!autoPlaying || working) {
      return;
    }

    if (tickets < 1) {
      setAutoPlaying(false);
      setWorking(false);
      return;
    }

    (async function () {
      /** Lock Process */
      setWorking(true);

      try {
        await startGameMutation.mutateAsync();

        /** Wait for countdown */
        setCountdown(Date.now() + GAME_DURATION);
        await delay(GAME_DURATION);

        /** Reset countdown */
        setCountdown(null);

        /** Claim Game */
        await claimGameMutation.mutateAsync();
      } catch {}

      /** Add a little delay */
      await delay(EXTRA_DELAY);

      /** Reset Mutation */
      try {
        await query.refetch();
      } catch {}

      /** Release Lock */
      setWorking(false);
    })();
  }, [autoPlaying, tickets, working]);

  return tomarket ? (
    <div className="flex flex-col gap-2">
      {tickets > 0 ? (
        <>
          <h3 className="font-bold">Game</h3>

          <TomarketInput
            disabled={autoPlaying || tickets < 1}
            value={desiredPoint}
            onInput={(ev) => dispatchAndSetDesiredPoint(ev.target.value)}
            type="number"
            min={MIN_POINT}
            max={MAX_POINT}
            placeholder={`Range (${MIN_POINT} - ${MAX_POINT})`}
          />
          <p className="text-gray-500">
            Minimum Point (automatically adds extra 1-20 points.)
          </p>
        </>
      ) : null}

      {/* Start or Stop Button  */}
      <TomarketButton
        color={autoPlaying ? "danger" : "primary"}
        disabled={tickets < 1}
        onClick={dispatchAndHandleAutoPlayClick}
      >
        {autoPlaying ? "Stop" : "Start"}
      </TomarketButton>

      {autoPlaying ? (
        <div className="flex flex-col gap-2 p-4 text-white bg-black rounded-lg">
          {/* Game Start */}
          {startGameMutation.isPending ? (
            <p className="font-bold text-yellow-500">Starting Game...</p>
          ) : startGameMutation.isError ? (
            <p className="font-bold text-red-500">Failed to start game...</p>
          ) : startGameMutation.isSuccess ? (
            <>
              <p className="font-bold text-green-500">
                ROUND ID: {startGameMutation.data?.["round_id"]}
              </p>
              <p>
                {countdown ? (
                  <Countdown
                    key={countdown}
                    date={countdown}
                    renderer={countdownRenderer}
                  />
                ) : claimGameMutation.isPending ? (
                  <span className="text-yellow-500">Claiming points...</span>
                ) : claimGameMutation.isError ? (
                  <span className="text-red-500">
                    Failed to claim points...
                  </span>
                ) : claimGameMutation.isSuccess ? (
                  <span className="font-bold text-green-500">
                    Points claimed. (Refreshing...)
                  </span>
                ) : null}
              </p>
            </>
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </div>
      ) : null}
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <div className="p-2 text-center text-white bg-black rounded-lg">
        Please relaunch Tomarket or the farmer...
      </div>
      <CgSpinner className="w-5 h-5 mx-auto animate-spin" />
    </div>
  );
}
