import { useQuery } from "@tanstack/react-query";

import useTomarketApi from "./useTomarketApi";

export default function useTomarketBalanceQuery() {
  const api = useTomarketApi();
  return useQuery({
    queryKey: ["tomarket", "balance"],
    queryFn: ({ signal }) =>
      api
        .post(
          "https://api-web.tomarket.ai/tomarket-game/v1/user/balance",
          null,
          {
            signal,
          }
        )
        .then((res) => res.data.data),
  });
}
