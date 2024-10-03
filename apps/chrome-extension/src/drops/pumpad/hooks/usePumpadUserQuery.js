import { useQuery } from "@tanstack/react-query";

import usePumpadApi from "./usePumpadApi";

export default function usePumpadUserQuery() {
  const api = usePumpadApi();
  return useQuery({
    queryKey: ["pumpad", "user"],
    queryFn: ({ signal }) =>
      api
        .get("https://tg.pumpad.io/referral/api/v1/tg/user/information", {
          signal,
        })
        .then((res) => res.data),
  });
}
