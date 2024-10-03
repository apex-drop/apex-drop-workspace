import { useQuery } from "@tanstack/react-query";

import useAgent301Api from "./useAgent301Api";

export default function useAgent301TasksQuery() {
  const api = useAgent301Api();
  return useQuery({
    queryKey: ["agent301", "tasks"],
    queryFn: ({ signal }) =>
      api
        .post("https://api.agent301.org/getTasks", null, {
          signal,
        })
        .then((res) => res.data),
  });
}
