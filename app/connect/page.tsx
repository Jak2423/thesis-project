"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Page() {
   const { isConnected } = useAccount();

   useEffect(() => {
      const router = useRouter();
      if (isConnected) {
         router.push("/dashboard");
      }
   }, [isConnected]);

   return (
      <main className="flex h-screen w-full  items-center justify-center bg-gray-950">
         <ConnectButton />
      </main>
   );
}
