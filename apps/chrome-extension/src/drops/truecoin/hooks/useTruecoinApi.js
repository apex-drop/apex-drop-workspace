import { useContext } from "react";

import TruecoinFarmerContext from "../context/TruecoinFarmerContext";

/**
 * @returns {import("axios").AxiosInstance}
 */
export default function useTruecoinApi() {
  return useContext(TruecoinFarmerContext).api;
}
