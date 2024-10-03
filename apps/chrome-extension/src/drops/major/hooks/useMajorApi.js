import { useContext } from "react";

import MajorFarmerContext from "../context/MajorFarmerContext";

export default function useMajorApi() {
  return useContext(MajorFarmerContext).api;
}
