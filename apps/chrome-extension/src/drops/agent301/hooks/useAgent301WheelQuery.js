import { useQuery } from "@tanstack/react-query";

import useAgent301Api from "./useAgent301Api";

export default function useAgent301WheelQuery() {
  const api = useAgent301Api();
  return useQuery({
    queryKey: ["agent301", "wheel"],
    queryFn: ({ signal }) =>
      api
        .post("https://api.agent301.org/wheel/load", null, {
          signal,
        })
        .then((res) => res.data),
  });
}
