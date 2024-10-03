import useDropFarmer from "@/hooks/useDropFarmer";

import TomarketIcon from "../assets/images/icon.png?format=webp";

export default function useTomarketFarmer() {
  return useDropFarmer({
    id: "tomarket",
    host: "mini-app.tomarket.ai",
    notification: {
      icon: TomarketIcon,
      title: "Tomarket Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      api
        .post("https://api-web.tomarket.ai/tomarket-game/v1/user/login", {
          init_data: telegramWebApp.initData,
          invite_code: "00003s0r", //DEV Invite Code
          from: "",
          is_bot: false,
        })
        .then((res) => res.data.data),
    extractAuth: (data) => `${data?.["access_token"]}`,
  });
}
