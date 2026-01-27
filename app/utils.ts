import { headers } from "next/headers";

export async function isMobileDevice(): Promise<boolean> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(userAgent);
}

export async function getDeviceType(): Promise<"mobile" | "desktop"> {
  return (await isMobileDevice()) ? "mobile" : "desktop";
}
