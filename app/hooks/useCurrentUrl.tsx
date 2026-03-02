"use client";
import { usePathname } from "next/navigation";

export function useCurrentUrl() {
  const pathname = usePathname();

  if (typeof window === "undefined") return "";

  return `${window.location.origin}${pathname}`;
}
