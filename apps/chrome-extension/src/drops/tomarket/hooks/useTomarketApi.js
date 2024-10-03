import { useContext } from "react";

import TomarketFarmerContext from "../context/TomarketFarmerContext";

export default function useTomarketApi() {
  return useContext(TomarketFarmerContext).api;
}
