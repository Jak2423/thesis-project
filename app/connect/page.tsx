"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Page() {
   const router = useRouter();
   const { isConnected } = useAccount();

   useEffect(() => {
      if (isConnected) {
         router.push("/dashboard");
      }
   }, [isConnected, router]);

   return (
      <main className="flex h-screen w-full  items-center justify-center bg-gray-950">
         <ConnectButton showBalance={false} accountStatus="address" />
      </main>
   );
}
