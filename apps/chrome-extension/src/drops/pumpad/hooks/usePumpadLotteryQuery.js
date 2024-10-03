import { useQuery } from "@tanstack/react-query";

import usePumpadApi from "./usePumpadApi";

export default function usePumpadLotteryQuery() {
  const api = usePumpadApi();
  return useQuery({
    queryKey: ["pumpad", "lottery"],
    queryFn: ({ signal }) =>
      api
        .get("https://tg.pumpad.io/referral/api/v1/lottery", {
          signal,
        })
        .then((res) => res.data),
  });
}
