import { useQuery } from "@tanstack/react-query";

import useAgent301Api from "./useAgent301Api";

export default function useAgent301BalanceQuery() {
  const api = useAgent301Api();

  return useQuery({
    queryKey: ["agent301", "balance"],
    queryFn: ({ signal }) =>
      api
        .post("https://api.agent301.org/getMe", null, {
          signal,
        })
        .then((res) => res.data),
  });
}
