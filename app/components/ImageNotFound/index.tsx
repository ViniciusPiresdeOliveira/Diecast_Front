import { ImageOff } from "lucide-react";

export const ImageNotFound = ({ className = "" }) => {
  return (
    <ImageOff
      className={`w-12 h-12 text-blue-300 group-hover:text-blue-700 transition-colors ${className}`}
    />
  );
};
