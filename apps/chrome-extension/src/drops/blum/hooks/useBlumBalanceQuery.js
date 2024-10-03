import { useQuery } from "@tanstack/react-query";

import useBlumApi from "./useBlumApi";

export default function useBlumBalanceQuery() {
  const api = useBlumApi();
  return useQuery({
    queryKey: ["blum", "balance"],
    queryFn: ({ signal }) =>
      api
        .get("https://game-domain.blum.codes/api/v1/user/balance", {
          signal,
        })
        .then((res) => res.data),
  });
}
