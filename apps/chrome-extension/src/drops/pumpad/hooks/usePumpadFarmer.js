import useDropFarmer from "@/hooks/useDropFarmer";

import PumpadIcon from "../assets/images/icon.png?format=webp";

export default function usePumpadFarmer() {
  return useDropFarmer({
    id: "pumpad",
    host: "tg.pumpad.io",
    notification: {
      icon: PumpadIcon,
      title: "Pumpad Farmer",
    },
    fetchAuth: (api, telegramWebApp) =>
      Promise.resolve({ auth: telegramWebApp.initData }),
    extractAuth: (data) => `tma ${data.auth}`,
  });
}
