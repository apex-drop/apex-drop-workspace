import { useMutation } from "@tanstack/react-query";

import useBlumApi from "./useBlumApi";

export default function useBlumStartGameMutation() {
  const api = useBlumApi();
  return useMutation({
    mutationKey: ["blum", "game", "start"],
    mutationFn: () =>
      api
        .post("https://game-domain.blum.codes/api/v1/game/play", null)
        .then((res) => res.data),
  });
}
