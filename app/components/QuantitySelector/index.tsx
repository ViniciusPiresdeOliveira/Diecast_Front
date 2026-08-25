import { Button } from "antd";
import { Minus, Plus } from "lucide-react";
import { QuantitySelectorProps } from "./types";

export const QuantitySelector = ({
  value = 0,
  onChange,
  min = 0,
  max,
  disabled = false,
}: QuantitySelectorProps) => {
  const decrement = () => {
    if (value > min) {
      onChange?.(value - 1);
    }
  };

  const increment = () => {
    if (max === undefined || value < max) {
      onChange?.(value + 1);
    }
  };

  return (
    <div
      className={`flex items-center justify-between rounded-md border-[#d9d9d9] border-[1px] rounded-md h-8 px-1  ${
        disabled ? "bg-[#f5f5f5] cursor-not-allowed" : "bg-white "
      }`}
    >
      <Button
        type="text"
        icon={<Minus size={16} />}
        onClick={decrement}
        disabled={disabled || value <= min}
      />

      <span
        className={`font-normal min-w-8 text-center ${disabled && "text-gray-400"}`}
      >
        {value}
      </span>

      <Button
        type="text"
        icon={<Plus size={16} />}
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
      />
    </div>
  );
};
