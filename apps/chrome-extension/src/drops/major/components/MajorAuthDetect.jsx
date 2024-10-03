import FarmerDetect from "@/components/FarmerDetect";

import MajorIcon from "../assets/images/icon.png?format=webp";

export default function MajorAuthDetect({ status }) {
  return (
    <FarmerDetect title={"Major Farmer"} icon={MajorIcon} status={status} />
  );
}
