"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
   return (
      <header className=" sticky top-0 z-20 mb-8 flex  w-full flex-col justify-center bg-gray-950">
         <div className=" flex w-full items-center justify-end  px-12 py-6">
            <ConnectButton showBalance={false} />
         </div>
      </header>
   );
}
