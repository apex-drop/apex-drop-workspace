import TruecoinIcon from "../assets/images/icon.png?format=webp";
import TruecoinLottery from "./TruecoinLottery";

export default function TruecoinFarmer() {
  return (
    <div className="flex flex-col gap-2 py-4">
      {/* Header */}
      <div className="flex items-center justify-center gap-2">
        <img
          src={TruecoinIcon}
          alt="Truecoin Farmer"
          className="w-8 h-8 rounded-full"
        />
        <h1 className="font-bold">Truecoin Farmer</h1>
      </div>

      {/* Lottery */}
      <TruecoinLottery />
    </div>
  );
}
