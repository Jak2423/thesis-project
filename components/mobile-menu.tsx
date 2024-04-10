"use client";

import { cn } from "@/lib/utils";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiHardDrive, FiShoppingCart, FiUpload } from "react-icons/fi";
import { IoTimeOutline } from "react-icons/io5";
import { PiCertificate } from "react-icons/pi";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";

const links = [
   {
      name: "My drive",
      href: "/dashboard/drive",
      icon: FiHardDrive,
   },
   {
      name: "Requests",
      href: "/dashboard/requests",
      icon: IoTimeOutline,
   },
   {
      name: "Marketplace",
      href: "/dashboard/marketplace",
      icon: FiShoppingCart,
   },
   {
      name: "Licenses",
      href: "/dashboard/licenses",
      icon: PiCertificate,
   },
];

export default function MobileMenu() {
   const [isOpenMenu, setIsOpenMenu] = useState(false);
   const pathname = usePathname();

   const closeMenu = () => setIsOpenMenu(false);

   return (
      <>
         <Button
            className="px-2 lg:hidden"
            variant="outline"
            onClick={() => setIsOpenMenu(!isOpenMenu)}
         >
            <HamburgerMenuIcon className="h-5 w-5" />
         </Button>
         <div
            className={cn(
               isOpenMenu ? " translate-x-0" : "translate-x-[-100%]",
               "fixed left-0 top-0 z-50 h-screen w-72 flex-col gap-y-4 border-r border-gray-200 bg-gray-50 py-4 transition-all duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-950 lg:hidden",
            )}
         >
            <div className="mb-4 flex items-center justify-between gap-x-2 px-6">
               <Link
                  href={"/dashboard"}
                  className="flex h-16 items-center justify-start"
                  onClick={closeMenu}
               >
                  <Logo className="size-10 fill-gray-950 dark:fill-gray-100" />
                  <span className="text-2xl font-semibold tracking-tighter">
                     Licens
                  </span>
               </Link>
               <Button className="px-2" variant="outline" onClick={closeMenu}>
                  <Cross1Icon className="size-4" />
               </Button>
            </div>
            <div className="flex flex-col items-start gap-y-4 px-6">
               <Link
                  href="/dashboard/upload"
                  className="flex w-full items-center justify-center gap-x-2 rounded-md bg-gray-800 px-4 py-3 text-gray-100 hover:opacity-80 dark:bg-gray-100 dark:text-gray-950"
                  onClick={closeMenu}
               >
                  <FiUpload className="h-5 w-5" />
                  <span className="">Upload file</span>
               </Link>
               {links.map((l, i) => {
                  const LinkIcon = l.icon;
                  return (
                     <Link
                        key={i}
                        href={l.href}
                        className={cn(
                           "flex w-full items-center gap-x-2 rounded-md px-4  py-3 text-sm  outline-1 hover:outline hover:outline-gray-200 dark:hover:outline-gray-800",
                           {
                              "outline outline-gray-200 dark:outline-gray-800":
                                 pathname === l.href,
                           },
                        )}
                        onClick={closeMenu}
                     >
                        <LinkIcon className="h-5 w-5" />
                        <span className="text-gray-800 dark:text-gray-200">
                           {l.name}
                        </span>
                     </Link>
                  );
               })}
            </div>
         </div>
      </>
   );
}
