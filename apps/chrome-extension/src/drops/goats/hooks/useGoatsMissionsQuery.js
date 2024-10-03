import { useQuery } from "@tanstack/react-query";

import useGoatsApi from "./useGoatsApi";

export default function useGoatsMissionsQuery() {
  const api = useGoatsApi();
  return useQuery({
    queryKey: ["goats", "missions"],
    queryFn: ({ signal }) =>
      api
        .get("https://api-mission.goatsbot.xyz/missions/user", {
          signal,
        })
        .then((res) => res.data),
  });
}
