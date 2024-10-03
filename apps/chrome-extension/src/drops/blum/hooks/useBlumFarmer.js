import useDropFarmer from "@/hooks/useDropFarmer";

import BlumIcon from "../assets/images/icon.png?format=webp";

export default function useBlumFarmer() {
  return useDropFarmer({
    id: "blum",
    host: "telegram.blum.codes",
    notification: {
      icon: BlumIcon,
      title: "Blum Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      api
        .post(
          "https://user-domain.blum.codes/api/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP",
          {
            query: telegramWebApp.initData,
            referralToken: "3AIqvLlFFK", //DEV Referral
          }
        )
        .then((res) => res.data),
    extractAuth: (data) => `Bearer ${data?.token?.access}`,
  });
}
