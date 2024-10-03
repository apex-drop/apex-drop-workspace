import { useMutation } from "@tanstack/react-query";

import useTruecoinApi from "./useTruecoinApi";

export default function useTruecoinLotteryMutation() {
  const api = useTruecoinApi();
  return useMutation({
    mutationKey: ["truecoin", "lottery", "spin"],
    mutationFn: () =>
      api.get("https://api.true.world/api/game/roll").then((res) => res.data),
  });
}
