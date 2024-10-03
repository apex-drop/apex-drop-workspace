import { useContext } from "react";

import Agent301FarmerContext from "../context/Agent301FarmerContext";

/**
 *
 * @returns {import("axios").AxiosInstance}
 */
export default function useAgent301Api() {
  return useContext(Agent301FarmerContext).api;
}
