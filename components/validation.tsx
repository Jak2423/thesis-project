"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseValidation.sol/LicenseValidation.json";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { contractAddress } from "@/contracts/constants";
import { useState } from "react";
import { useReadContract } from "wagmi";

export default function Validation() {
   const [licenseNum, setLicenseNum] = useState("");

   const { data: isValid, refetch } = useReadContract({
      address: contractAddress,
      abi: licenseValidationAbi.abi,
      functionName: "isLicenseValid",
      args: [licenseNum],
   });

   function handleRevokeLicense() {
      if (licenseNum) {
         refetch();
      }
   }

   return (
      <div className="relative w-full lg:w-2/3">
         <input
            type="text"
            className="block w-full rounded-lg border border-gray-800  bg-transparent p-4 text-lg font-medium  text-white placeholder-gray-400 outline-none transition-all duration-100 ease-in focus-visible:ring-1 focus-visible:ring-gray-300"
            placeholder="Лицензийн Дугаар"
            onChange={(e) => setLicenseNum(e.target.value)}
            required
         />
         <Dialog>
            <DialogTrigger asChild>
               <button
                  className="absolute bottom-2.5 end-2.5 top-2.5 rounded-lg bg-gray-50 px-4 py-2 text-gray-900 hover:bg-gray-50/90 hover:opacity-80"
                  onClick={handleRevokeLicense}
               >
                  Шалгах
               </button>
            </DialogTrigger>
            <DialogContent className="text-gray-200">
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
      </div>
   );
}
