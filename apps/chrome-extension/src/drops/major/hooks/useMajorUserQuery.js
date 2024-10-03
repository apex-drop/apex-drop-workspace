import { useQuery } from "@tanstack/react-query";

import useMajorApi from "./useMajorApi";

export default function useMajorUserQuery() {
  const api = useMajorApi();
  const streakQuery = useQuery({
    refetchInterval: false,
    queryKey: ["major", "streak"],
    queryFn: ({ signal }) =>
      api
        .get("https://major.bot/api/user-visits/streak/", {
          signal,
        })
        .then((res) => res.data),
  });

  const userQuery = useQuery({
    enabled: streakQuery.isSuccess,
    queryKey: ["major", "user", streakQuery.data?.["user_id"]],
    queryFn: ({ signal }) =>
      api
        .get(`https://major.bot/api/users/${streakQuery.data?.["user_id"]}/`, {
          signal,
        })
        .then((res) => res.data),
  });

  return userQuery;
}
