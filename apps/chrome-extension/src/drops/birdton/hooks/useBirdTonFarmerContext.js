import { useContext } from "react";

import BirdTonFarmerContext from "../context/BirdTonFarmerContext";

export default function useBirdTonFarmerContext() {
  return useContext(BirdTonFarmerContext);
}
