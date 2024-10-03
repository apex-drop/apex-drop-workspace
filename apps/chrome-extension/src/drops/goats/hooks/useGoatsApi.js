import { useContext } from "react";

import GoatsFarmerContext from "../context/GoatsFarmerContext";

export default function useGoatsApi() {
  return useContext(GoatsFarmerContext).api;
}
