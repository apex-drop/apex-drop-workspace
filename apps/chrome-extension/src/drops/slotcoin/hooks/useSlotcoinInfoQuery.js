import { useQuery } from "@tanstack/react-query";

import useSlotcoinApi from "./useSlotcoinApi";

export default function useSlotcoinInfoQuery() {
  const api = useSlotcoinApi();
  return useQuery({
    refetchInterval: 10_000,
    queryKey: ["slotcoin", "info"],
    queryFn: ({ signal }) =>
      api
        .post("https://api.slotcoin.app/v1/clicker/api/info", null, {
          signal,
        })
        .then((res) => res.data),
  });
}
