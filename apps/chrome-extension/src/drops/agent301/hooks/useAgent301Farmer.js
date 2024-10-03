import useDropFarmer from "@/hooks/useDropFarmer";

import Agent301Icon from "../assets/images/icon.png?format=webp";

export default function useAgent301Farmer() {
  return useDropFarmer({
    id: "agent301",
    host: "telegram.agent301.org",
    notification: {
      icon: Agent301Icon,
      title: "Agent301 Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      Promise.resolve({ auth: telegramWebApp.initData }),
    extractAuth: (data) => data.auth,
  });
}
