import { useContext } from "react";

import BlumFarmerContext from "../context/BlumFarmerContext";

export default function useBlumApi() {
  return useContext(BlumFarmerContext).api;
}
