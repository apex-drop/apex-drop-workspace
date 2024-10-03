import { useMutation } from "@tanstack/react-query";

import useTruecoinApi from "./useTruecoinApi";

export default function useTruecoin50SpinsBoost() {
  const api = useTruecoinApi();
  return useMutation({
    mutationKey: ["truecoin", "boost", 50, "spins"],
    mutationFn: () =>
      api
        .post("https://api.true.world/api/boosts/buy", {
          code: "50_ad_additional_spins",
        })
        .then((res) => res.data),
  });
}
