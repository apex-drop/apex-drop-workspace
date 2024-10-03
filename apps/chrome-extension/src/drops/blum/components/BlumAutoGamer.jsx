import Countdown from "react-countdown";
import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import useSocketHandlers from "@/hooks/useSocketHandlers";
import useSocketState from "@/hooks/useSocketState";
import { delay } from "@/lib/utils";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import BlumButton from "./BlumButton";
import BlumInput from "./BlumInput";
import useBlumBalanceQuery from "../hooks/useBlumBalanceQuery";
import useBlumClaimGameMutation from "../hooks/useBlumClaimGameMutation";
import useBlumStartGameMutation from "../hooks/useBlumStartGameMutation";

const GAME_DURATION = 30_000;
const EXTRA_DELAY = 3_000;
const MIN_POINT = 100;
const INITIAL_POINT = 180;
const MAX_POINT = 280;

export default function Blum() {
  const query = useBlumBalanceQuery();
  const client = useQueryClient();

  const [working, setWorking] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [desiredPoint, setDesiredPoint, dispatchAndSetDesiredPoint] =
    useSocketState("blum.game.desired-point", INITIAL_POINT);

  const tickets = query.data?.playPasses || 0;
  const points = useMemo(
    () => Math.max(MIN_POINT, Math.min(MAX_POINT, desiredPoint)),
    [desiredPoint]
  );

  const startGameMutation = useBlumStartGameMutation();
  const claimGameMutation = useBlumClaimGameMutation(points);

  /** Countdown renderer */
  const countdownRenderer = useCallback(
    ({ seconds }) => <span className="text-xl font-bold">{seconds}</span>,
    []
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
          action: "blum.autoplay",
        });
      }, [])
    );

  /** Handlers */
  useSocketHandlers(
    useMemo(
      () => ({
        "blum.autoplay": () => {
          handleAutoPlayClick();
        },
      }),
      [handleAutoPlayClick]
    )
  );

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
        const game = await startGameMutation.mutateAsync();

        /** Wait for countdown */
        setCountdown(Date.now() + GAME_DURATION);
        await delay(GAME_DURATION);

        /** Reset countdown */
        setCountdown(null);

        /** Claim Game */
        await claimGameMutation.mutateAsync(game.gameId);
      } catch {}

      /** Add a little delay */
      await delay(EXTRA_DELAY);

      /** Reset Mutation */
      try {
        await client.refetchQueries({
          queryKey: ["blum", "balance"],
        });
      } catch {}

      /** Release Lock */
      setWorking(false);
    })();
  }, [autoPlaying, tickets, working]);

  return (
    <div className="flex flex-col gap-2">
      {tickets > 0 ? (
        <>
          <BlumInput
            disabled={autoPlaying || tickets < 1}
            value={desiredPoint}
            onInput={(ev) => dispatchAndSetDesiredPoint(ev.target.value)}
            type="number"
            min={MIN_POINT}
            max={MAX_POINT}
            placeholder={`Range (${MIN_POINT} - ${MAX_POINT})`}
          />
          <p className="text-gray-400">
            Minimum Point (automatically adds extra 1-20 points.)
          </p>
        </>
      ) : null}

      {/* Start or Stop Button  */}
      <BlumButton
        color={autoPlaying ? "danger" : "primary"}
        disabled={tickets < 1}
        onClick={dispatchAndHandleAutoPlayClick}
      >
        {autoPlaying ? "Stop" : "Start"}
      </BlumButton>

      {autoPlaying ? (
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-neutral-800">
          {/* Game Start */}
          {startGameMutation.isPending ? (
            <p className="font-bold text-yellow-500">Starting Game...</p>
          ) : startGameMutation.isError ? (
            <p className="font-bold text-red-500">Failed to start game...</p>
          ) : startGameMutation.isSuccess ? (
            <>
              <p className="font-bold text-blum-green-500">
                GAME ID: {startGameMutation.data?.gameId}
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
                  <span className="font-bold text-blum-green-500">
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
  );
}
