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
import Spinner from "@/components/ui/spinner";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { convertTimestampToDate, formatAddress } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import saveAs from "file-saver";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import {
   useAccount,
   useReadContract,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";

export default function Page({ params }: { params: { id: string } }) {
   const [hasError, setHasError] = useState(false);
   const [fileHash, setFileHash] = useState("");
   const { isConnected } = useAccount();

   const {
      writeContract,
      isPending,
      error: writeError,
      data: hash,
      isError: issueError,
   } = useWriteContract();

   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });

   const {
      data: file,
      isLoading: isReadLoading,
      error,
   } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFileById",
      args: [Number(params.id)],
   }) as { data: UploadedFile; isLoading: boolean; error: any };

   function issueLicense(data: UploadedFile) {
      if (isConnected) {
         writeContract({
            abi: licenseValidationAbi.abi,
            address: licenseValidationContract.contractAddress as `0x${string}`,
            functionName: "issueLicense",
            args: [
               data.owner,
               data.id,
               data.fileName,
               data.description,
               data.category,
               data.fileHash,
               data.isPublic,
            ],
         });
         setFileHash(data.fileHash);
      }
   }

   useEffect(() => {
      isSuccess &&
         saveAs(
            `https://silver-patient-falcon-52.mypinata.cloud/ipfs/${fileHash}`,
            `licensed.pdf`,
         );
   }, [isSuccess]);

   useEffect(() => {
      setHasError(true);
   }, [error]);

   return (
      <main className="flex h-full w-full flex-col items-start px-8">
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
         {file && (
            <div className="mb-8 grid w-full grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
               <div className="col-span-1">
                  <div className="h-96 w-full bg-gray-800"></div>
               </div>
               <div className="col-span-1 md:col-span-2">
                  <h3 className="mb-8 flex items-center text-4xl font-bold">
                     {file.fileName}
                  </h3>
                  <div className="mb-8 space-y-4">
                     <p className="text-lg">
                        <span className="font-bold">Эзэмшигч: </span>
                        {formatAddress(file.owner)}
                     </p>
                     <p className="text-lg">
                        <span className="font-bold">Ангилал: </span>
                        {file.category}
                     </p>
                     <p className="text-lg">
                        <span className="font-bold">Үүсгэсэн: </span>
                        {format(
                           convertTimestampToDate(Number(file.createdAt)),
                           "yyyy.MM.dd",
                        )}
                     </p>
                     <p className="text-sm">{file.description}</p>
                  </div>
                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <Button
                           variant="outline"
                           size="lg"
                           className="flex- items-center"
                           disabled={isPending}
                        >
                           <FiShoppingCart className="mr-2 w-5" />
                           Авах
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
            </div>
         )}
      </main>
   );
}
