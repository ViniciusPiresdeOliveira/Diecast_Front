import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { LabelProps } from "./types";

export const Label = ({ text, className }: LabelProps) => {
  return (
    <label
      className={twMerge(clsx("text-sm font-medium text-gray-700", className))}
    >
      {text}
    </label>
  );
};
