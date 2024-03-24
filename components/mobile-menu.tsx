"use client";

import { cn } from "@/lib/utils";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiGlobe, FiHardDrive, FiShoppingCart, FiUpload } from "react-icons/fi";
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
      name: "Marketplace",
      href: "/dashboard/marketplace",
      icon: FiShoppingCart,
   },
   {
      name: "Public files",
      href: "/dashboard/files",
      icon: FiGlobe,
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
               "fixed left-0 top-0 z-50 h-screen w-72 flex-col gap-y-4 border-r border-gray-800 bg-gray-950 py-4 transition-all duration-200 ease-in-out lg:hidden",
            )}
         >
            <div className="mb-4 flex items-center justify-between gap-x-2 border-gray-800 px-6">
               <Link
                  href={"/dashboard"}
                  className="flex h-16 items-center justify-start"
               >
                  <Logo className="size-10 fill-gray-50" />
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
                  className="flex w-full items-center justify-center gap-x-2 rounded-md bg-gray-100 px-4 py-3 text-gray-950 hover:opacity-80"
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
                           "flex w-full items-center gap-x-2 rounded-md px-4  py-3 text-sm  outline-1 hover:bg-gray-950 hover:outline hover:outline-gray-800",
                           {
                              "bg-gray-950 outline outline-gray-800":
                                 pathname === l.href,
                           },
                        )}
                        onClick={closeMenu}
                     >
                        <LinkIcon className="h-5 w-5" />
                        <span className="text-gray-200">{l.name}</span>
                     </Link>
                  );
               })}
            </div>
         </div>
      </>
   );
}
