"use client";

import { cn } from "@/app/utils";
import { Warehouse } from "lucide-react";
import { GarageButtonProps } from "./types";

export const GarageButton = ({
  onClick,
  variant = "card",
  isMobile = false,
  className = "",
  disabled = false,
}: GarageButtonProps) => {
  if (variant === "table") {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
        disabled={disabled}
      >
        <Warehouse size={20} color="#1f3565" />
      </button>
    );
  }

  const visibilityClasses = isMobile
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "z-10 cursor-pointer w-8 h-8 absolute right-2 bottom-21",
        "flex items-center justify-center rounded-full",
        "transition-all duration-300 hover:scale-110",
        visibilityClasses,
        className,
      )}
      disabled={disabled}
    >
      <Warehouse size={24} color="#1f3565" />
    </button>
  );
};
