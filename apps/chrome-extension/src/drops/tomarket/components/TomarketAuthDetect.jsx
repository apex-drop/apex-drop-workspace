import FarmerDetect from "@/components/FarmerDetect";

import TomarketIcon from "../assets/images/icon.png?format=webp";

export default function TomarketAuthDetect({ status }) {
  return (
    <FarmerDetect
      title={"Tomarket Farmer"}
      icon={TomarketIcon}
      status={status}
      className="text-gray-400"
    />
  );
}