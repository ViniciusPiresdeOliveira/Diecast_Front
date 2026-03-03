import { useContext } from "react";
import { TypeDeviceContext } from "../contexts/TypeDevice";

export function useTypeDevice() {
  const context = useContext(TypeDeviceContext);

  if (!context) {
    throw new Error(
      "useTypeDevice deve ser usado dentro de TypeDeviceProvider",
    );
  }

  return context;
}
