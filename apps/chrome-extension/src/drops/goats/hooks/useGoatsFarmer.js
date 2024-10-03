import useDropFarmer from "@/hooks/useDropFarmer";

import GoatsIcon from "../assets/images/icon.png?format=webp";

export default function useGoatsFarmer() {
  return useDropFarmer({
    id: "goats",
    host: "dev.goatsbot.xyz",
    notification: {
      icon: GoatsIcon,
      title: "Goats Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      api
        .post(
          "https://dev-api.goatsbot.xyz/auth/login",
          {},
          {
            headers: {
              rawdata: telegramWebApp.initData,
            },
          }
        )
        .then((res) => res.data),
    extractAuth: (data) => `Bearer ${data?.tokens?.access?.token}`,
  });
}
