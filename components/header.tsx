"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import MobileMenu from "./mobile-menu";
import { Button } from "./ui/button";

export default function Header() {
   const { setTheme, theme } = useTheme();

   const handleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark");
   };

   return (
      <header className="sticky top-0 z-20 mb-8 flex w-full flex-col justify-center border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
         <div className=" flex w-full items-center justify-between px-8 py-4 lg:justify-end">
            <MobileMenu />
            <div className="flex items-center gap-x-4">
               <Button variant="ghost" size="icon" onClick={handleTheme}>
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
               </Button>
               <ConnectButton
                  showBalance={false}
                  accountStatus={{
                     smallScreen: "avatar",
                     largeScreen: "full",
                  }}
               />
            </div>
         </div>
      </header>
   );
}
