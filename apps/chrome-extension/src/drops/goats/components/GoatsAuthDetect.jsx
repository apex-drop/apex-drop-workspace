import FarmerDetect from "@/components/FarmerDetect";

import GoatsIcon from "../assets/images/icon.png?format=webp";

export default function GoatsAuthDetect({ status }) {
  return (
    <FarmerDetect title={"Goats Farmer"} icon={GoatsIcon} status={status} />
  );
}
