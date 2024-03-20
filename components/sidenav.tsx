"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGlobe, FiHardDrive, FiShoppingCart, FiUpload } from "react-icons/fi";
import { PiCertificate } from "react-icons/pi";
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

export default function SideNav() {
   const pathname = usePathname();

   return (
      <div className="hidden h-screen flex-col gap-y-4 border-r border-gray-800 bg-gray-950 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72">
         <div className="mb-4  border-gray-800 px-6">
            <Link
               href={"/dashboard"}
               className="flex h-16 items-center justify-start"
            >
               <Logo className="size-10" />
               <span className="text-2xl font-semibold tracking-tighter">
                  Licens
               </span>
            </Link>
         </div>
         <div className="flex flex-col items-start gap-y-4 px-6">
            <Link
               href="/dashboard/files/new"
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
                  >
                     <LinkIcon className="h-5 w-5" />
                     <span className="text-gray-200">{l.name}</span>
                  </Link>
               );
            })}
         </div>
      </div>
   );
}
