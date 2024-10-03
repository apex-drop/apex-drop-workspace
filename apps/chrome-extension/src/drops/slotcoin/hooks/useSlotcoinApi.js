import { useContext } from "react";

import SlotcoinFarmerContext from "../context/SlotcoinFarmerContext";

export default function useSlotcoinApi() {
  return useContext(SlotcoinFarmerContext).api;
}
