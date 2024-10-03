import { useMutation } from "@tanstack/react-query";

import useAgent301Api from "./useAgent301Api";

export default function useAgent301CompleteTaskMutation() {
  const api = useAgent301Api();
  return useMutation({
    mutationKey: ["agent301", "task", "complete"],
    mutationFn: (data) =>
      api
        .post("https://api.agent301.org/completeTask", data)
        .then((res) => res.data),
  });
}
