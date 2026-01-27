"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface TypeDeviceContextData {
  isMobile: boolean;
  setMobile: () => void;
  setDesktop: () => void;
}

const TypeDeviceContext = createContext<TypeDeviceContextData | undefined>(
  undefined,
);

interface TypeDeviceProviderProps {
  children: ReactNode;
  initialIsMobile: boolean;
}

export function TypeDeviceProvider({
  children,
  initialIsMobile,
}: TypeDeviceProviderProps) {
  const [isMobile, setIsMobile] = useState(initialIsMobile);

  const setMobile = () => setIsMobile(true);
  const setDesktop = () => setIsMobile(false);

  return (
    <TypeDeviceContext.Provider
      value={{
        isMobile,
        setMobile,
        setDesktop,
      }}
    >
      {children}
    </TypeDeviceContext.Provider>
  );
}

export function useTypeDevice() {
  const context = useContext(TypeDeviceContext);

  if (!context) {
    throw new Error(
      "useTypeDevice deve ser usado dentro de TypeDeviceProvider",
    );
  }

  return context;
}
