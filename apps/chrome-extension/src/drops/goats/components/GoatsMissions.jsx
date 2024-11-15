import { cn, delay } from "@/lib/utils";
import { useEffect } from "react";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import useGoatsCompleteMissionMutation from "../hooks/useGoatsCompleteMissionMutation";
import useGoatsMissionsQuery from "../hooks/useGoatsMissionsQuery";

export default function GoatsMissions() {
  const client = useQueryClient();
  const missionsQuery = useGoatsMissionsQuery();

  const missions = useMemo(
    () =>
      missionsQuery.data
        ? Object.values(missionsQuery.data).reduce(
            (missions, item) => missions.concat(item),
            []
          )
        : [],
    [missionsQuery.data]
  );

  const completedMissions = useMemo(
    () => missions.filter((item) => item.status),
    [missions]
  );

  const uncompletedMissions = useMemo(
    () => missions.filter((item) => !item.status),
    [missions]
  );

  const completeMissionMutation = useGoatsCompleteMissionMutation();

  const [autoClaiming, setAutoClaiming] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [missionOffset, setMissionOffset] = useState(null);

  const reset = () => {
    setCurrentMission(null);
    setMissionOffset(null);
  };

  /** Handle button click */
  const handleAutoMissionClick = () => {
    reset();
    setAutoClaiming((previous) => !previous);
  };

  useEffect(() => {
    if (!autoClaiming) {
      return;
    }

    (async function name() {
      for (let [index, mission] of Object.entries(uncompletedMissions)) {
        setMissionOffset(index);
        setCurrentMission(mission);
        try {
          await completeMissionMutation.mutateAsync(mission["_id"]);
        } catch {}

        /** Delay */
        await delay(2_000);
      }

      try {
        await client.refetchQueries({
          queryKey: ["goats", "missions"],
        });
        await client.refetchQueries({
          queryKey: ["goats", "user"],
        });
      } catch {}

      reset();
      setAutoClaiming(false);
    })();
  }, [autoClaiming]);

  return (
    <div className="p-4">
      {missionsQuery.isPending ? (
        <div className="flex justify-center">Loading...</div>
      ) : // Error
      missionsQuery.isError ? (
        <div className="flex justify-center text-red-500">
          Failed to fetch missions...
        </div>
      ) : (
        // Success
        <div className="flex flex-col gap-2">
          <div className="flex flex-col p-2 text-black bg-white rounded-lg">
            <p>
              <span className="font-bold text-blue-500">Missions</span>:{" "}
              <span className="font-bold">{completedMissions.length}</span> /{" "}
              <span className="font-bold">{missions.length}</span>
            </p>
          </div>
          <button
            disabled={autoClaiming}
            onClick={handleAutoMissionClick}
            className={cn(
              "p-2 rounded-lg disabled:opacity-50",
              autoClaiming ? "bg-red-500 text-black" : "bg-white text-black"
            )}
          >
            {autoClaiming ? "Stop" : "Start"}
          </button>

          {autoClaiming && currentMission ? (
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-neutral-800">
              <h4 className="font-bold">
                <span className="text-yellow-500">
                  Running Mission{" "}
                  {missionOffset !== null ? +missionOffset + 1 : null}
                </span>
              </h4>
              <h5 className="font-bold">{currentMission.name}</h5>
              <p
                className={cn(
                  "capitalize",
                  {
                    success: "text-green-500",
                    error: "text-red-500",
                  }[completeMissionMutation.status]
                )}
              >
                {completeMissionMutation.status}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
