"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import Spinner from "@/components/ui/spinner";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { FileRequest } from "@/lib/type";
import { convertTimestampToDate } from "@/lib/utils";
import { CheckCircledIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
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
         <ScreenHeader className="mb-8">Requests</ScreenHeader>
         <div className="flex w-full flex-col gap-y-4">
            <Table containerClassname="overflow-x-auto relative">
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-4/12 px-2 py-1 font-semibold">
                        Name
                     </TableHead>
                     <TableHead className="w-2/12 px-2 py-1 font-semibold">
                        Requested
                     </TableHead>
                     <TableHead className="w-4/12 px-2 py-1 font-semibold">
                        User
                     </TableHead>
                     <TableHead className="w-1/12 px-2 py-1 font-semibold"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {requests &&
                     requests.toReversed().map((r) => (
                        <TableRow
                           className="border-gray-200 dark:border-gray-800"
                           key={r.requestId}
                        >
                           <TableCell className="line-clamp-1 flex items-center gap-x-2 font-semibold leading-8">
                              {r.fileName}
                           </TableCell>
                           <TableCell>
                              {format(
                                 convertTimestampToDate(Number(r.requestedAt)),
                                 "PP",
                              )}
                           </TableCell>
                           <TableCell>{r.requester}</TableCell>
                           <TableCell>
                              {r.isApproved ? (
                                 <div className="flex items-center justify-center rounded-md border px-2 py-1 ">
                                    <span className="text-sm font-semibold">
                                       Approved
                                    </span>
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-x-4">
                                    <Button
                                       size="icon"
                                       variant="outline"
                                       disabled={isPending || r.isApproved}
                                       onClick={() =>
                                          approveRequest(r.requestId)
                                       }
                                    >
                                       <CheckIcon className="size-5 text-green-400" />
                                    </Button>
                                    <Button
                                       size="icon"
                                       variant="outline"
                                       disabled={isPending || r.isApproved}
                                       onClick={() =>
                                          rejectRequest(r.requestId)
                                       }
                                    >
                                       <Cross2Icon className="size-5 text-red-400" />
                                    </Button>
                                 </div>
                              )}
                           </TableCell>
                        </TableRow>
                     ))}
               </TableBody>
            </Table>
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
