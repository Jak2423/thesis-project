"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import PdfThumbnail from "@/components/pdf-thumbnail";
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
import Spinner from "@/components/ui/spinner";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { convertTimestampToDate, formatAddress } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useState } from "react";
import {
   useAccount,
   useReadContract,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";

export default function Page({ params }: { params: { id: string } }) {
   const [fileHash, setFileHash] = useState("");
   const { isConnected, address } = useAccount();

   const { writeContract, isPending, data: hash } = useWriteContract();

   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });

   const { data: file } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFileById",
      args: [Number(params.id)],
   }) as { data: UploadedFile };

   function requestLicense(id: number, owner: string) {
      if (isConnected) {
         writeContract({
            abi: licenseValidationAbi.abi,
            account: address,
            address: licenseValidationContract.contractAddress as `0x${string}`,
            functionName: "requestLicense",
            args: [id, owner],
         });
      }
   }
   // useEffect(() => {
   //    isSuccess &&
   //       saveAs(
   //          `https://silver-patient-falcon-52.mypinata.cloud/ipfs/${fileHash}`,
   //          `licensed.pdf`,
   //       );
   // }, [isSuccess]);

   return (
      <main className="flex h-full w-full flex-col items-start px-8">
         {file && (
            <div className="mb-8 grid w-full grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
               <div className="col-span-1">
                  <PdfThumbnail
                     url={`https://silver-patient-falcon-52.mypinata.cloud/ipfs/${file.fileHash}`}
                  />
               </div>
               <div className="col-span-1 md:col-span-2">
                  <h3 className="mb-8 flex items-center text-4xl font-bold">
                     {file.fileName}
                  </h3>
                  <div className="mb-8 space-y-4">
                     <p className="text-lg">
                        <span className="font-bold">Эзэмшигч: </span>
                        {formatAddress(file.fileOwner)}
                     </p>
                     <p className="text-lg">
                        <span className="font-bold">Төрөл: </span>
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
                           disabled={isPending}
                        >
                           Хүсэлт илгээх
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
                              onClick={() =>
                                 requestLicense(file.id, file.fileOwner)
                              }
                           >
                              Continue
                           </AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </div>
            </div>
         )}
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
               <AlertDescription>Хүсэлт амжилттай илгээгдлээ.</AlertDescription>
            </Alert>
         )}
         {isError && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Алдаа</AlertTitle>
               <AlertDescription>
                  Хүсэлт илгээхэд алдаа гарлаа.
               </AlertDescription>
            </Alert>
         )}
      </main>
   );
}
