"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { useState } from "react";
import { useReadContract } from "wagmi";

export default function Validation() {
   const [licenseNum, setLicenseNum] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const { data: isValid, refetch } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "validateLicense",
      args: [licenseNum],
   });

   function handleRevokeLicense(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      refetch();
      setIsDialogOpen(true);
   }

   return (
      <form className="relative w-full lg:w-2/3" onSubmit={handleRevokeLicense}>
         <input
            type="text"
            className="block w-full rounded-lg border border-gray-200 bg-transparent p-4  text-lg font-medium text-gray-950 placeholder-gray-400  outline-none transition-all duration-100 ease-in focus-visible:ring-1 focus-visible:ring-gray-300 dark:border-gray-800 dark:text-gray-50"
            placeholder="Лицензийн Дугаар"
            value={licenseNum}
            onChange={(e) => setLicenseNum(e.target.value)}
            required
         />
         <button className="absolute bottom-2.5 end-2.5 top-2.5 rounded-lg bg-gray-950 px-4 py-2 text-gray-100 hover:opacity-80  dark:bg-gray-50 dark:text-gray-900">
            Шалгах
         </button>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="text-gray-800 dark:text-gray-200">
               <DialogHeader>
                  <DialogTitle>
                     {isValid
                        ? "Лиценз баталгаажсан."
                        : "Лиценз баталгаажаагүй."}
                  </DialogTitle>
                  <DialogDescription>
                     {isValid
                        ? "Лиценз нь блокчэйн сүлжээнд баталгаажсан байна."
                        : "Лиценз нь блокчэйн сүлжээнд баталгаажаагүй байна."}
                  </DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      </form>
   );
}
