import { useMutation } from "@tanstack/react-query";
import usePumpadApi from "./usePumpadApi";

export default function usePumpadLotteryMutation() {
  const api = usePumpadApi();
  return useMutation({
    mutationKey: ["pumpad", "lottery", "spin"],
    mutationFn: () =>
      api
        .post("https://tg.pumpad.io/referral/api/v1/lottery", null)
        .then((res) => res.data),
  });
}
