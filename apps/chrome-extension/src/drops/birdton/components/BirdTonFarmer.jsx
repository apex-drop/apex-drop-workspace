import CoinIcon from "../assets/images/coin.png?format=webp";
import EnergyIcon from "../assets/images/energy.png?format=webp";
import useBirdTonFarmerContext from "../hooks/useBirdTonFarmerContext";

export default function BirdTonFarmer() {
  const { eventData, authQuery } = useBirdTonFarmerContext();
  const user = authQuery.data;

  const energy = user["energy"] || 0;
  const maxEnergy = user["energy_capacity"] || 0;

  return (
    <div className="flex flex-col gap-2 py-4">
      <h3 className="text-2xl font-bold text-center">
        <img src={CoinIcon} className="inline w-5 h-5" />{" "}
        {Intl.NumberFormat().format(user["balance"])}
      </h3>

      <h4 className="flex justify-center text-sm font-bold text-center">
        <span className="p-2  bg-[#ffcd04] rounded-full">
          <img src={EnergyIcon} className="inline w-5" /> {energy} / {maxEnergy}
        </span>
      </h4>

      <p className="text-center text-black">Under Construction...</p>
    </div>
  );
}
