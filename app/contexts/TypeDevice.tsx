"use client";

import { createContext, ReactNode, useState } from "react";

interface TypeDeviceContextData {
  isMobile: boolean;
  setMobile: () => void;
  setDesktop: () => void;
}

export const TypeDeviceContext = createContext<
  TypeDeviceContextData | undefined
>(undefined);

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
