import SlotcoinAuthDetect from "./components/SlotcoinAuthDetect";
import SlotcoinFarmer from "./components/SlotcoinFarmer";
import SlotcoinFarmerContext from "./context/SlotcoinFarmerContext";
import useSlotcoinFarmer from "./hooks/useSlotcoinFarmer";

function Slotcoin() {
  const farmer = useSlotcoinFarmer();
  return (
    <SlotcoinFarmerContext.Provider value={farmer}>
      {farmer.auth ? (
        <SlotcoinFarmer />
      ) : (
        <SlotcoinAuthDetect status={farmer.status} />
      )}
    </SlotcoinFarmerContext.Provider>
  );
}

export default Slotcoin;
