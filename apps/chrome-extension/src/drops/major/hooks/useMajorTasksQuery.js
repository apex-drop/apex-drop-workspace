import { useQuery } from "@tanstack/react-query";

import useMajorApi from "./useMajorApi";

export default function useMajorTasksQuery(daily = false) {
  const api = useMajorApi();

  return useQuery({
    queryKey: ["major", "tasks", daily],
    queryFn: ({ signal }) =>
      api
        .get(`https://major.bot/api/tasks/?is_daily=${daily}`, {
          signal,
        })
        .then((res) => res.data),
  });
}
