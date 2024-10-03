import { useContext } from "react";

import PumpadFarmerContext from "../context/PumpadFarmerContext";

export default function usePumpadApi() {
  return useContext(PumpadFarmerContext).api;
}
