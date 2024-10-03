import { useMutation } from "@tanstack/react-query";
import useBlumApi from "./useBlumApi";

export default function useBlumClaimTaskMutation() {
  const api = useBlumApi();
  return useMutation({
    mutationKey: ["blum", "task", "claim"],
    mutationFn: ({ id }) =>
      api
        .post(`https://earn-domain.blum.codes/api/v1/tasks/${id}/claim`, null)
        .then((res) => res.data),
  });
}
