"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ScreenHeader from "@/components/ui/screen-header";
import Spinner from "@/components/ui/spinner";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { FileRequest } from "@/lib/type";
import { formatAddress } from "@/lib/utils";
import { CheckCircledIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import {
   useAccount,
   useReadContract,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";

export default function Page() {
   const { address, isConnected } = useAccount();
   const { writeContract, isPending, data: hash } = useWriteContract();

   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });

   const { data: requests, refetch } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getFileOwnerLicenseRequests",
      account: address,
   }) as { data: FileRequest[]; refetch: any };

   const approveRequest = (id: number) => {
      if (isConnected) {
         writeContract({
            abi: licenseValidationAbi.abi,
            account: address,
            address: licenseValidationContract.contractAddress as `0x${string}`,
            functionName: "approveLicenseRequest",
            args: [id],
         });
      }
   };

   const rejectRequest = (id: number) => {
      if (isConnected) {
         writeContract({
            abi: licenseValidationAbi.abi,
            account: address,
            address: licenseValidationContract.contractAddress as `0x${string}`,
            functionName: "rejectLicenseRequest",
            args: [id],
         });
      }
   };

   useEffect(() => {
      isSuccess && refetch();
   }, [isSuccess, refetch]);

   return (
      <main className="flex w-full flex-col items-start px-8">
         <ScreenHeader title="Pending Requests" />
         <div className="flex w-full flex-col gap-y-4">
            {requests &&
               requests.toReversed().map((r, i) => (
                  <div
                     className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                     key={i}
                  >
                     <div className="flex w-full flex-col justify-start gap-y-1">
                        <h4 className="text-ellipsis text-lg leading-none tracking-tight">
                           Customer: {formatAddress(r.requester)} is requesting
                           access for File id: {Number(r.fileId)} file.
                        </h4>
                     </div>
                     {r.isApproved ? (
                        <p className="flex items-center  rounded-md border  px-2 py-1 ">
                           <span className="text-sm font-semibold">
                              Approved
                           </span>
                        </p>
                     ) : (
                        // <p className="text-sm font-semibold">Approved</p>
                        <div className="flex items-center gap-x-4">
                           <Button
                              size="icon"
                              variant="outline"
                              disabled={isPending || r.isApproved}
                              onClick={() => approveRequest(r.requestId)}
                           >
                              <CheckIcon className="size-5 text-green-400" />
                           </Button>
                           <Button
                              size="icon"
                              variant="outline"
                              disabled={isPending || r.isApproved}
                              onClick={() => rejectRequest(r.requestId)}
                           >
                              <Cross2Icon className="size-5 text-red-400" />
                           </Button>
                        </div>
                     )}
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
               <AlertDescription>Лиценз амжилттай зөвшөөрлөө.</AlertDescription>
            </Alert>
         )}
         {isError && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Алдаа</AlertTitle>
               <AlertDescription>
                  Лиценз зөвшөөрөхөд алдаа гарлаа.
               </AlertDescription>
            </Alert>
         )}
      </main>
   );
}
