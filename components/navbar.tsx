"use client";
import { formatAddress } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";

let ethereum: any;

if (typeof window !== "undefined") ethereum = (window as any).ethereum;

export default function Navbar() {
   const [account, setAccount] = useState("");

   const checkEthereumExists = () => {
      if (!ethereum) {
         console.log("Please Install MetaMask.");
         return false;
      }
      return true;
   };

   const connectWallet = async () => {
      if (checkEthereumExists()) {
         try {
            const accounts = await ethereum.request({
               method: "eth_requestAccounts",
            });
            setAccount(accounts[0]);
         } catch (err: any) {
            console.log(err.message);
         }
      }
   };

   const getConnectedAccounts = async () => {
      try {
         const accounts = await ethereum.request({
            method: "eth_accounts",
         });
         console.log(accounts);
         setAccount(accounts[0]);
      } catch (err: any) {
         console.log(err.message);
      }
   };

   useEffect(() => {
      connectWallet();
   }, []);

   return (
      <nav className="mb-8 flex w-full flex-col justify-center py-8">
         <div className="mx-auto flex w-full items-center justify-between lg:max-w-screen-lg ">
            <div className="flex items-center space-x-10">
               <Link href={"/"}>
                  <span className="text-xl font-semibold uppercase tracking-widest">
                     LICENS
                  </span>
               </Link>
               <Link href={"/create-license"}>
                  <span className="text-sm text-gray-200 hover:opacity-70">
                     Лиценз Бүртгүүлэх
                  </span>
               </Link>
            </div>

            {account ? (
               <Button variant={"outline"} size={"lg"} disabled>
                  {formatAddress(account)}
               </Button>
            ) : (
               <Link
                  href={"/"}
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                  onClick={connectWallet}
               >
                  Нэвтрэх
               </Link>
            )}
         </div>
      </nav>
   );
}
