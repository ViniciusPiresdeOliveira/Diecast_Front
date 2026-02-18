import { LabelProps } from "./types";

export const Label = ({ text }: LabelProps) => {
  return <label className="text-sm font-medium">{text}</label>;
};
