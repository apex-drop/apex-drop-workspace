import useDropFarmer from "@/hooks/useDropFarmer";

import MajorIcon from "../assets/images/icon.png?format=webp";

export default function useMajorFarmer() {
  return useDropFarmer({
    id: "major",
    host: "major.bot",
    notification: {
      icon: MajorIcon,
      title: "Major Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      api
        .post("https://major.bot/api/auth/tg/", {
          init_data: telegramWebApp.initData,
        })
        .then((res) => res.data),
    extractAuth: (data) => `Bearer ${data?.["access_token"]}`,
  });
}
