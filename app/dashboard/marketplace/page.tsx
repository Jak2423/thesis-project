"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import PdfIcon from "@/components/ui/pdf-icon";
import ScreenHeader from "@/components/ui/screen-header";
import Spinner from "@/components/ui/spinner";
import { contractAddress } from "@/contracts/constants";
import { UploadedFile } from "@/lib/type";
import { formatAddress } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

import {
   useAccount,
   useReadContract,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";

export default function Page() {
   const [hasError, setHasError] = useState(false);
   const { address } = useAccount();
   const { isConnected } = useAccount();

   const {
      writeContract,
      isPending,
      error: writError,
      data: hash,
      isError: issueError,
   } = useWriteContract();

   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });

   const {
      data: MarketFiles,
      isLoading: isReadLoading,
      error,
   } = useReadContract({
      address: contractAddress,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFilesExceptUser",
      account: address,
   }) as { data: UploadedFile[]; isLoading: boolean; error: any };

   function issueLicense(data: UploadedFile) {
      if (isConnected) {
         writeContract({
            abi: licenseValidationAbi.abi,
            address: contractAddress,
            functionName: "issueLicense",
            args: [
               address,
               data.id,
               data.fileName,
               data.description,
               data.category,
               data.fileHash,
               data.isPublic,
            ],
         });
      }
   }

   useEffect(() => {
      console.log(error);
      setHasError(true);
   }, [error]);

   return (
      <main className="flex w-2/4 flex-col items-start px-8">
         <ScreenHeader title="Marketplace" />
         <div className="flex w-full flex-col gap-y-4">
            {!isReadLoading &&
               MarketFiles.map((file, i) => (
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
                        <h4 className="truncate text-sm leading-none tracking-tight">
                           Owner: {formatAddress(file.owner)}
                        </h4>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                           {file.description}
                        </p>
                     </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="outline" size="icon">
                              <FiShoppingCart className="w-5" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle className="dark:text-gray-50">
                                 Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                 This action cannot be undone. This will
                                 permanently delete your account and remove your
                                 data from our servers.
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel className="dark:text-gray-50">
                                 Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                 onClick={() => issueLicense(file)}
                              >
                                 Continue
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  </div>
               ))}
         </div>
         {isLoading && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:left-auto md:w-1/3">
               <Spinner className="h-5 w-5" />
               <AlertTitle>Баталгаажуулж байна</AlertTitle>
               <AlertDescription>
                  Баталгаажуулахыг хүлээж байна...
               </AlertDescription>
            </Alert>
         )}
         {isSuccess && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:left-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Амжилттай</AlertTitle>
               <AlertDescription>Лиценз амжилттай үүсгэгдлээ.</AlertDescription>
            </Alert>
         )}
         {isError && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Алдаа</AlertTitle>
               <AlertDescription>
                  Лиценз баталгаажуулахад алдаа гарлаа.
               </AlertDescription>
            </Alert>
         )}
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
