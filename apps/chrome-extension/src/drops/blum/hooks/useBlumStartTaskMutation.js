import { useMutation } from "@tanstack/react-query";
import useBlumApi from "./useBlumApi";

export default function useBlumStartTaskMutation() {
  const api = useBlumApi();
  return useMutation({
    mutationKey: ["blum", "task", "start"],
    mutationFn: (id) =>
      api
        .post(`https://earn-domain.blum.codes/api/v1/tasks/${id}/start`, null)
        .then((res) => res.data),
  });
}
