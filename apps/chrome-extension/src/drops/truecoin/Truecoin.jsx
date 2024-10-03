import TruecoinAuthDetect from "./components/TruecoinAuthDetect";
import TruecoinFarmer from "./components/TruecoinFarmer";
import TruecoinFarmerContext from "./context/TruecoinFarmerContext";
import useTruecoinFarmer from "./hooks/useTruecoinFarmer";

function Truecoin() {
  const farmer = useTruecoinFarmer();
  return (
    <TruecoinFarmerContext.Provider value={farmer}>
      {farmer.auth ? (
        <TruecoinFarmer />
      ) : (
        <TruecoinAuthDetect status={farmer.status} />
      )}
    </TruecoinFarmerContext.Provider>
  );
}

export default Truecoin;
