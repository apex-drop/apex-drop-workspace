import PumpadAuthDetect from "./components/PumpadAuthDetect";
import PumpadFarmer from "./components/PumpadFarmer";
import PumpadFarmerContext from "./context/PumpadFarmerContext";
import usePumpadFarmer from "./hooks/usePumpadFarmer";

function Pumpad() {
  const farmer = usePumpadFarmer();
  return (
    <PumpadFarmerContext.Provider value={farmer}>
      {farmer.auth ? (
        <PumpadFarmer />
      ) : (
        <PumpadAuthDetect status={farmer.status} />
      )}
    </PumpadFarmerContext.Provider>
  );
}

export default Pumpad;
