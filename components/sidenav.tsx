"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHardDrive, FiShoppingCart, FiUpload } from "react-icons/fi";
import { IoTimeOutline } from "react-icons/io5";
import { PiCertificate } from "react-icons/pi";
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

export default function SideNav() {
   const pathname = usePathname();

   return (
      <div className="hidden h-screen flex-col gap-y-4 border-r border-gray-200 bg-gray-50 py-4 dark:border-gray-800 dark:bg-gray-950 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72">
         <div className="mb-4 px-6">
            <Link
               href={"/dashboard"}
               className="flex h-16 items-center justify-start gap-x-1"
            >
               <Logo className="size-10 fill-gray-950 dark:fill-gray-100" />
               <span className="text-2xl font-semibold tracking-tighter">
                  Licens
               </span>
            </Link>
         </div>
         <div className="flex flex-col items-start gap-y-4 px-6">
            <Link
               href="/dashboard/upload"
               className="flex w-full items-center justify-center gap-x-2 rounded-md bg-gray-800 px-4 py-3 text-gray-100 hover:opacity-80 dark:bg-gray-100 dark:text-gray-950"
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
                        "flex w-full items-center gap-x-2 rounded-md px-4 py-3 outline-1 outline-gray-200  hover:outline   dark:hover:outline-gray-800",
                        {
                           "bg-gray-100 outline outline-gray-200 dark:bg-gray-950 dark:outline-gray-800":
                              pathname === l.href,
                        },
                     )}
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
   );
}
