import { useMutation } from "@tanstack/react-query";

import useBlumApi from "./useBlumApi";

export default function useBlumClaimGameMutation(points) {
  const api = useBlumApi();
  return useMutation({
    mutationKey: ["blum", "game", "claim", points],
    mutationFn: (id) =>
      api
        .post("https://game-domain.blum.codes/api/v1/game/claim", {
          gameId: id,
          points: points + Math.floor(Math.random() * 20),
        })
        .then((res) => res.data),
  });
}
