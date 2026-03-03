import { MessageErrorProps } from "./types";

export const MessageError = ({ message }: MessageErrorProps) => {
  return <span className="text-red-primary">{message}</span>;
};
