"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { cn } from "@/lib/utils";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFolder, FiHome, FiShoppingCart, FiUpload } from "react-icons/fi";
import { IoTimeOutline } from "react-icons/io5";
import { PiArrowUpRight, PiCertificate, PiVaultFill } from "react-icons/pi";
import { formatEther } from "viem";
import {
   useAccount,
   useReadContract,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Logo } from "./ui/logo";

const links = [
   {
      name: "Home",
      href: "/dashboard",
      icon: FiHome,
   },
   {
      name: "My drive",
      href: "/dashboard/drive",
      icon: FiFolder,
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

   const { address, isConnected } = useAccount();
   const { writeContract, isPending, data: hash } = useWriteContract();

   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });

   const {
      data: fund,
      error,
      refetch,
   } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getWithdrawableFund",
      account: address,
   }) as { data: number; error: any; refetch: any };

   const withdrawFund = () => {
      if (isConnected) {
         writeContract({
            abi: licenseValidationAbi.abi,
            account: address,
            address: licenseValidationContract.contractAddress as `0x${string}`,
            functionName: "withdrawFund",
         });
      }
   };

   useEffect(() => {
      isSuccess && refetch();
   }, [isSuccess]);

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
               "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col justify-between gap-y-4 border-r border-gray-200 bg-gray-50 py-4 transition-all duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-950 lg:hidden",
            )}
         >
            <div className=" flex flex-col ">
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
                  <Button
                     className="px-2"
                     variant="outline"
                     onClick={closeMenu}
                  >
                     <Cross1Icon className="size-4" />
                  </Button>
               </div>
               <div className="flex flex-1 flex-col items-start gap-y-4 px-6">
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
            <div className="mb-8 flex h-14 gap-x-2 px-6">
               <Card className="flex w-full items-center justify-between rounded-md bg-gray-100 dark:bg-gray-900">
                  <CardHeader className="border-r border-gray-200 px-2 py-4 dark:border-gray-800">
                     <PiVaultFill className="size-6" />
                  </CardHeader>
                  <CardContent className="p-0">
                     <p className="flex gap-x-2 pr-4 font-semibold">
                        <span>{fund ? formatEther(BigInt(fund)) : "0"}</span>
                        ETH
                     </p>
                  </CardContent>
               </Card>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button
                        size="sm"
                        disabled={Number(fund) <= 0}
                        className="h-14"
                     >
                        <PiArrowUpRight className="size-5" />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle className="dark:text-gray-50">
                           Өөрийн Цахим бүтээлийн орлогыг татах уу?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                           Цахим бүтээлийн орлого татах
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel className="dark:text-gray-50">
                           Цуцлах
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={withdrawFund}>
                           Татах
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>
         </div>
      </>
   );
}
