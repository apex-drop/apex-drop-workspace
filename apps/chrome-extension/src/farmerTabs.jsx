import Agent301Icon from "@/drops/agent301/assets/images/icon.png?format=webp&w=80";
import AppIcon from "@/assets/images/icon-wrapped.png?format=webp&w=80";
import BirdTonIcon from "@/drops/birdton/assets/images/icon.png?format=webp&w=80";
import BlumIcon from "@/drops/blum/assets/images/icon.png?format=webp&w=80";
import GoatsIcon from "@/drops/goats/assets/images/icon.png?format=webp&w=80";
import MajorIcon from "@/drops/major/assets/images/icon.png?format=webp&w=80";
import PumpadIcon from "@/drops/pumpad/assets/images/icon.png?format=webp&w=80";
import SlotcoinIcon from "@/drops/slotcoin/assets/images/icon.png?format=webp&w=80";
import TelegramWeb from "@/TelegramWeb";
import TelegramWebAIcon from "@/assets/images/telegram-web-a.png?format=webp&w=80";
import TelegramWebKIcon from "@/assets/images/telegram-web-k.png?format=webp&w=80";
import TomarketIcon from "@/drops/tomarket/assets/images/icon.png?format=webp&w=80";
import TruecoinIcon from "@/drops/truecoin/assets/images/icon.png?format=webp&w=80";
import Welcome from "@/Welcome";
import Farmer from "./Farmer";

const farmerTabs = [
  {
    id: "apex-drop-farmer",
    title: "Apex Drop Farmer",
    icon: AppIcon,
    component: <Welcome />,
  },
  {
    id: "telegram-web-k",
    title: "Telegram WebK",
    icon: TelegramWebKIcon,
    component: <TelegramWeb version="k" />,
  },
  {
    id: "telegram-web-a",
    title: "Telegram WebA",
    icon: TelegramWebAIcon,
    component: <TelegramWeb version="a" />,
  },
  {
    id: "major",
    title: "Major",
    icon: MajorIcon,
    component: <Farmer farmer="Major" />,
  },
  {
    id: "blum",
    title: "Blum",
    icon: BlumIcon,
    component: <Farmer farmer="Blum" />,
  },
  {
    id: "tomarket",
    title: "Tomarket",
    icon: TomarketIcon,
    component: <Farmer farmer="Tomarket" />,
  },
  {
    id: "pumpad",
    title: "Pumpad",
    icon: PumpadIcon,
    component: <Farmer farmer="Pumpad" />,
  },
  {
    id: "slotcoin",
    title: "Slotcoin",
    icon: SlotcoinIcon,
    component: <Farmer farmer="Slotcoin" />,
  },
  {
    id: "agent301",
    title: "Agent 301",
    icon: Agent301Icon,
    component: <Farmer farmer="Agent301" />,
  },

  {
    id: "goats",
    title: "Goats",
    icon: GoatsIcon,
    component: <Farmer farmer="Goats" />,
  },
  {
    id: "truecoin",
    title: "Truecoin",
    icon: TruecoinIcon,
    component: <Farmer farmer="Truecoin" />,
  },
  {
    id: "birdton",
    title: "BirdTON",
    icon: BirdTonIcon,
    component: <Farmer farmer="BirdTon" />,
  },
];

export default farmerTabs;
