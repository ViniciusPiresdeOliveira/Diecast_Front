"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleRedirectUser = () => [router.push("/home")];

  return (
    <div className="bg-amber-300 flex justify-center items-center">
      <button onClick={handleRedirectUser} className="">
        Home
      </button>
    </div>
  );
}
