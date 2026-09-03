"use client";

import { cn } from "@/app/utils";
import { Trash2 } from "lucide-react";
import { DeleteButtonProps } from "./types";

export const DeleteButton = ({
  onClick,
  variant = "card",
  isMobile = false,
  className = "",
}: DeleteButtonProps) => {
  if (variant === "table") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <Trash2 size={20} color="#f31a13" />
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
        "z-10 cursor-pointer w-8 h-8 absolute right-2 bottom-12",
        "flex items-center justify-center rounded-full",
        "transition-all duration-300 hover:scale-110",
        visibilityClasses,
        className,
      )}
    >
      <Trash2 size={24} color="#f31a13" />
    </button>
  );
};
