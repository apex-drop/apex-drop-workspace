import GoatsAuthDetect from "./components/GoatsAuthDetect";
import GoatsFarmer from "./components/GoatsFarmer";
import GoatsFarmerContext from "./context/GoatsFarmerContext";
import useGoatsFarmer from "./hooks/useGoatsFarmer";

function Goats() {
  const farmer = useGoatsFarmer();
  return (
    <div className="flex flex-col min-w-0 min-h-0 text-white bg-black grow">
      <GoatsFarmerContext.Provider value={farmer}>
        {farmer.auth ? (
          <GoatsFarmer />
        ) : (
          <GoatsAuthDetect status={farmer.status} />
        )}
      </GoatsFarmerContext.Provider>
    </div>
  );
}

export default Goats;
