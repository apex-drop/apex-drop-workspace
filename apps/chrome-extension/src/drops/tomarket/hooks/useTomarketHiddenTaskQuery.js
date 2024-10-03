import { useQuery } from "@tanstack/react-query";

import useTomarketApi from "./useTomarketApi";

export default function useTomarketHiddenTaskQuery() {
  const api = useTomarketApi();
  return useQuery({
    queryKey: ["tomarket", "hidden-task"],
    queryFn: ({ signal }) =>
      api
        .post(
          "https://api-web.tomarket.ai/tomarket-game/v1/tasks/hidden",
          null,
          {
            signal,
          }
        )
        .then((res) => res.data.data),
  });
}
