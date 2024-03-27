"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import PdfIcon from "@/components/ui/pdf-icon";
import ScreenHeader from "@/components/ui/screen-header";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { formatAddress } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const [hasError, setHasError] = useState(false);
   const [fileHash, setFileHash] = useState("");
   const { address, isConnected } = useAccount();

   const {
      data: marketFiles,
      isLoading,
      error,
   } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFilesExceptUser",
      account: address,
   }) as { data: UploadedFile[]; isLoading: boolean; error: any };

   useEffect(() => {
      setHasError(true);
   }, [error]);

   // useEffect(() => {
   //    isSuccess &&
   //       saveAs(
   //          `https://silver-patient-falcon-52.mypinata.cloud/ipfs/${fileHash}`,
   //          `licensed.pdf`,
   //       );
   // }, [isSuccess]);

   return (
      <main className="flex w-full flex-col items-start px-8">
         <ScreenHeader title="Marketplace" />
         <div className="flex w-full flex-col gap-y-4">
            {marketFiles &&
               marketFiles.map((file, i) => (
                  <div
                     className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                     key={i}
                  >
                     <div className="">
                        <PdfIcon width="70" height="100%" />
                     </div>
                     <div className="flex w-full flex-col justify-start gap-y-1">
                        <Link href={`/dashboard/marketplace/${file.id}`}>
                           <h3 className="truncate text-lg font-semibold tracking-tight">
                              {file.fileName}
                           </h3>
                        </Link>
                        <h4 className="text-ellipsis text-sm leading-none tracking-tight">
                           Owner: {formatAddress(file.owner)}
                        </h4>
                        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                           {file.description}
                        </p>
                     </div>
                  </div>
               ))}
         </div>
         {error && (
            <Dialog open={hasError} onOpenChange={setHasError}>
               <DialogContent className="dark:text-gray-200">
                  <DialogHeader className=" overflow-auto text-ellipsis text-wrap">
                     <DialogTitle>{error?.name}</DialogTitle>
                     <DialogDescription>{error?.message}</DialogDescription>
                  </DialogHeader>
               </DialogContent>
            </Dialog>
         )}
      </main>
   );
}
