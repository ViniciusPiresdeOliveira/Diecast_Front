"use client";

import { Pencil } from "lucide-react";
import { EditButtonProps } from "./types";

export const EditButton = ({
  onClick,
  variant = "card",
  isMobile = false,
}: EditButtonProps) => {
  if (variant === "table") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <Pencil size={20} color="#07ac5a" />
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
      className={
        "z-10 cursor-pointer w-8 h-8 absolute right-2 bottom-30 " +
        "flex items-center justify-center " +
        "transition-all duration-300 hover:scale-110 " +
        visibilityClasses
      }
    >
      <Pencil size={24} color="#07ac5a" />
    </button>
  );
};
