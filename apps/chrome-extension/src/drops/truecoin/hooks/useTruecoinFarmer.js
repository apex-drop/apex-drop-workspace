import useDropFarmer from "@/hooks/useDropFarmer";
import TruecoinIcon from "../assets/images/icon.png?format=webp";

export default function useTruecoinFarmer() {
  return useDropFarmer({
    id: "truecoin",
    host: "bot.true.world",
    notification: {
      icon: TruecoinIcon,
      title: "Truecoin Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      api
        .post(
          "https://api.true.world/api/auth/signIn",
          {
            tgWebAppStartParam: null,
            tgPlatform: telegramWebApp.platform,
            tgVersion: telegramWebApp.version,
            lang: telegramWebApp.initDataUnsafe.user.language_code,
            userId: telegramWebApp.initDataUnsafe.user.id,
          },
          {
            headers: {
              query: telegramWebApp.initData,
            },
          }
        )
        .then((res) => res.data),
    extractAuth: (data) => `Bearer ${data?.["token"]}`,
  });
}
