"use client";

import { useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Drawer } from "./components/Drawer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuVisibility, setMenuVisibility] = useState(false);

  const handleVisibilityMenu = () => {
    setMenuVisibility((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Drawer
        isVisible={menuVisibility}
        handleVisibility={handleVisibilityMenu}
      />

      <Header handleVisibilityMenu={handleVisibilityMenu} />
      <main className="pt-5 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
