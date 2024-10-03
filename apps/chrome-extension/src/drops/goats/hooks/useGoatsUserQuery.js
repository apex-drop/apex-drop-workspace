import { useQuery } from "@tanstack/react-query";

import useGoatsApi from "./useGoatsApi";

export default function useGoatsUserQuery() {
  const api = useGoatsApi();
  return useQuery({
    queryKey: ["goats", "user"],
    queryFn: ({ signal }) =>
      api
        .get("https://api-me.goatsbot.xyz/users/me", {
          signal,
          withCredentials: true,
        })
        .then((res) => res.data),
  });
}
