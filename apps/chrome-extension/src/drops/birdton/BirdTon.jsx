import BirdTonDetect from "./components/BirdTonDetect";
import BirdTonFarmer from "./components/BirdTonFarmer";
import BirdTonFarmerContext from "./context/BirdTonFarmerContext";
import useBirdTon from "./hooks/useBirdTon";

export default function BirdTon() {
  const birdTon = useBirdTon();

  return (
    <BirdTonFarmerContext.Provider value={birdTon}>
      <div className="flex flex-col text-white grow bg-birdton-blue-500">
        {birdTon.connected ? <BirdTonFarmer /> : <BirdTonDetect />}
      </div>
    </BirdTonFarmerContext.Provider>
  );
}
