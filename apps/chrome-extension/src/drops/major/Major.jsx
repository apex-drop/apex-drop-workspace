import MajorAuthDetect from "./components/MajorAuthDetect";
import MajorFarmer from "./components/MajorFarmer";
import MajorFarmerContext from "./context/MajorFarmerContext";
import useMajorFarmer from "./hooks/useMajorFarmer";

function Major() {
  const farmer = useMajorFarmer();
  return (
    <MajorFarmerContext.Provider value={farmer}>
      {farmer.auth ? (
        <MajorFarmer />
      ) : (
        <MajorAuthDetect status={farmer.status} />
      )}
    </MajorFarmerContext.Provider>
  );
}

export default Major;
