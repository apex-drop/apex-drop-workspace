import { useQuery } from "@tanstack/react-query";

import useBlumApi from "./useBlumApi";

export default function useBlumUserQuery() {
  const api = useBlumApi();
  return useQuery({
    queryKey: ["blum", "user"],
    queryFn: ({ signal }) =>
      api
        .get("https://user-domain.blum.codes/api/v1/user/me", {
          signal,
        })
        .then((res) => res.data),
  });
}
