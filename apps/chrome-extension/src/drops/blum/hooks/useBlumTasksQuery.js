import { useQuery } from "@tanstack/react-query";

import useBlumApi from "./useBlumApi";

export default function useBlumTasksQuery() {
  const api = useBlumApi();
  return useQuery({
    queryKey: ["blum", "tasks"],
    queryFn: ({ signal }) =>
      api
        .get("https://earn-domain.blum.codes/api/v1/tasks", {
          signal,
        })
        .then((res) => res.data),
  });
}
