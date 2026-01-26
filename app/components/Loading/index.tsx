"use client";
import { useLoading } from "@/app/contexts/LoagindContext";
import Image from "next/image";

export const Loading = () => {
  const { loading } = useLoading();
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
          <div
            className="relative w-56 h-56"
            // style={{
            //   animation: "loadingAnim 2.5s ease-in-out infinite",
            // }}
            style={{
              animation: "scalePulse 1.2s ease-in-out infinite",
            }}
            // style={{
            //   animation: "comboLoading 3s ease-in-out infinite",
            // }}
          >
            <Image
              src="/image/logo.jpg"
              alt="Logo"
              fill
              priority
              className="object-contain rounded-b-full rounded-t-full"
            />
          </div>
        </div>
      )}
    </>
  );
};
