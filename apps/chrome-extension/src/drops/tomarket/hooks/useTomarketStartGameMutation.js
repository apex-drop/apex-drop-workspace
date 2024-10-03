import { useMutation } from "@tanstack/react-query";

import useTomarketApi from "./useTomarketApi";

export default function useTomarketStartGameMutation(id) {
  const api = useTomarketApi();
  return useMutation({
    mutationKey: ["tomarket", "game", "start", id],
    mutationFn: () =>
      api
        .post("https://api-web.tomarket.ai/tomarket-game/v1/game/play", {
          game_id: id,
        })
        .then((res) => res.data.data),
  });
}
