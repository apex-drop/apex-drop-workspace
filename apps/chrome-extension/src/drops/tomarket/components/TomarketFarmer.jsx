import TomarketAutoGamer from "./TomarketAutoGamer";
import TomarketBalanceDisplay from "./TomarketBalanceDisplay";
import TomarketDailyCombo from "./TomarketDailyCombo";
import TomarketFarmerHeader from "./TomarketFarmerHeader";

export default function TomarketFarmer() {
  return (
    <div className="flex flex-col p-4">
      <TomarketFarmerHeader />
      <TomarketBalanceDisplay />

      <TomarketDailyCombo />
      <TomarketAutoGamer />
    </div>
  );
}
