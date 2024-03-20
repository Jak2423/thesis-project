"use client";

import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Header() {
   const pathname = usePathname();
   const [isOpenMenu, setIsOpenMenu] = useState(false);

   useEffect(() => {
      setIsOpenMenu(false);
   }, [pathname]);

   return (
      <header className=" flex w-full flex-col justify-center px-8 py-8 lg:px-0">
         <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-y-4 lg:max-w-screen-lg ">
            <Link href={"/"}>
               <span className="text-xl font-semibold uppercase tracking-widest">
                  LICENS
               </span>
            </Link>
            <Button
               className="px-2 md:hidden"
               variant="outline"
               onClick={() => setIsOpenMenu(!isOpenMenu)}
            >
               <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
            <div
               className={cn(
                  "flex flex-grow basis-full flex-col items-start space-y-5 overflow-hidden transition-all delay-200  duration-300 ease-in-out md:flex md:basis-auto md:flex-row md:items-center  md:justify-end md:space-x-10 md:space-y-0 md:overflow-visible lg:min-h-10",
                  {
                     "h-0": !isOpenMenu,
                     "h-[150px]": isOpenMenu,
                  },
               )}
            >
               <Link href={"/dashboard/drive"}>
                  <span className="text-sm text-gray-200 hover:opacity-70">
                     Drive
                  </span>
               </Link>
               <Link href={"/dashboard/files"}>
                  <span className="text-sm text-gray-200 hover:opacity-70">
                     Public Files
                  </span>
               </Link>
               <Link href={"/dashboard/files/new"}>
                  <span className="text-sm text-gray-200 hover:opacity-70">
                     New File
                  </span>
               </Link>
               <ConnectButton showBalance={false} />
            </div>
         </div>
      </header>
   );
}
