export interface GarageButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "card" | "table";
  isMobile?: boolean;
  disabled?: boolean;
  className?: string;
}
