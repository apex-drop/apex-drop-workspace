import FarmerDetect from "@/components/FarmerDetect";

import BlumIcon from "../assets/images/icon.png?format=webp";

export default function BlumAuthDetect({ status }) {
  return (
    <FarmerDetect
      title={"Blum Farmer"}
      icon={BlumIcon}
      status={status}
      className="text-gray-400"
    />
  );
}
