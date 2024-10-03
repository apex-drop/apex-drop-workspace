import useDropFarmer from "@/hooks/useDropFarmer";

import SlotcoinIcon from "../assets/images/icon.png?format=webp";

export default function useSlotcoinFarmer() {
  return useDropFarmer({
    id: "slotcoin",
    host: "app.slotcoin.app",
    notification: {
      icon: SlotcoinIcon,
      title: "Slotcoin Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      api
        .post("https://api.slotcoin.app/v1/clicker/auth", {
          initData: telegramWebApp.initData,
          referralCode: "a2dd-60f7", //DEV Invite Code
        })
        .then((res) => res.data),
    extractAuth: (data) => `${data?.["accessToken"]}`,
  });
}
