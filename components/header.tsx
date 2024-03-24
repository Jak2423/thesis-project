"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import MobileMenu from "./mobile-menu";

export default function Header() {
   const [isOpenMenu, setIsOpenMenu] = useState(false);

   return (
      <header className="sticky top-0 z-20 mb-8 flex  w-full flex-col justify-center bg-gray-950">
         <div className=" flex w-full items-center justify-between px-8  py-6 lg:justify-end">
            <MobileMenu />
            <ConnectButton
               showBalance={false}
               accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
               }}
            />
         </div>
      </header>
   );
}
