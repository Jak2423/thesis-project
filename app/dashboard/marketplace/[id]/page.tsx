"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { convertTimestampToDate, formatAddress } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import Image from "next/image";
import { BiCalendar, BiCategoryAlt, BiUser } from "react-icons/bi";
import {
   FaFileAudio,
   FaFileImage,
   FaFileLines,
   FaFileVideo,
} from "react-icons/fa6";
import { LiaEthereum } from "react-icons/lia";
import { formatEther } from "viem";
import {
   useAccount,
   useBalance,
   useReadContract,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";

export default function Page({ params }: { params: { id: string } }) {
   const { isConnected, address } = useAccount();
   const { writeContract, isPending, data: hash, error } = useWriteContract();
   const { data: balance } = useBalance({
      address: address,
   });

   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });
   const { toast } = useToast();

   const { data: file } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFileById",
      args: [Number(params.id)],
   }) as { data: UploadedFile };

   function requestLicense(
      id: number,
      owner: string,
      fileName: string,
      assetPrice: number,
   ) {
      if (!isConnected) {
         toast({
            variant: "destructive",
            description: "Please connect your wallet first.",
         });
         return;
      }
      if (file && BigInt(balance.value) < BigInt(file.price)) {
         toast({
            variant: "destructive",
            description: "Insufficient balance.",
         });
         return;
      }

      writeContract({
         abi: licenseValidationAbi.abi,
         account: address,
         address: licenseValidationContract.contractAddress as `0x${string}`,
         functionName: "requestLicense",
         args: [id, owner, fileName, assetPrice],
         value: assetPrice,
      });
   }

   return (
      <main className="flex h-full w-full flex-col items-start px-8">
         {file && (
            <div className="mb-8 grid w-full grid-cols-1 grid-rows-2 gap-x-8 gap-y-4 md:grid-cols-3 md:grid-rows-1">
               <div className="order-last col-span-1 flex items-center justify-center md:order-first">
                  {file.imgUrl ? (
                     <div className="relative h-full w-full">
                        <Image
                           src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${file.imgUrl}`}
                           alt={file.fileName}
                           priority={true}
                           sizes="100vw"
                           fill
                           className="h-auto w-full object-contain object-top"
                        />
                     </div>
                  ) : (
                     (file.category === "PDF" && (
                        <FaFileLines className="size-48 md:size-64" />
                     )) ||
                     (file.category === "Image" && (
                        <FaFileImage className="size-48 md:size-64" />
                     )) ||
                     (file.category === "Video" && (
                        <FaFileVideo className="size-48 md:size-64" />
                     )) ||
                     (file.category === "Audio" && (
                        <FaFileAudio className="size-48 md:size-64" />
                     ))
                  )}
               </div>
               <div className="col-span-1 md:col-span-2">
                  <div className="mb-8 flex flex-col gap-y-4">
                     <h3 className="text-4xl font-semibold">{file.fileName}</h3>
                     <p className="text-sm">{file.description}</p>
                  </div>
                  <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-4">
                     <div className="flex items-center gap-x-4">
                        <BiCategoryAlt className="size-10" />
                        <div className="flex flex-col">
                           <span className="font-light">Type </span>
                           <span className="font-semibold">
                              {file.category}
                           </span>
                        </div>
                     </div>
                     <div className="flex items-center gap-x-4">
                        <BiUser className="size-10" />
                        <div className="flex flex-col">
                           <span className="font-light">Owner </span>
                           <span className="font-semibold">
                              {file.fileOwner === address
                                 ? "You"
                                 : formatAddress(file.fileOwner)}
                           </span>
                        </div>
                     </div>
                     <div className="flex items-center gap-x-4">
                        <BiCalendar className="size-10" />
                        <div className="flex flex-col">
                           <span className="font-light">Uploaded at</span>
                           <span className="font-semibold">
                              {format(
                                 convertTimestampToDate(Number(file.createdAt)),
                                 "PP",
                              )}
                           </span>
                        </div>
                     </div>
                     <div className="flex items-center gap-x-4">
                        <LiaEthereum className="size-10" />
                        <div className="flex flex-col">
                           <span className="font-light">Price</span>
                           <span className="font-semibold">
                              {formatEther(BigInt(file.price))} ETH
                           </span>
                        </div>
                     </div>
                  </div>
                  <Button
                     size="lg"
                     disabled={isPending || file.fileOwner === address}
                     className="mt-12 w-full max-w-40"
                     onClick={() =>
                        requestLicense(
                           file.id,
                           file.fileOwner,
                           file.fileName,
                           file.price,
                        )
                     }
                  >
                     Aвах
                  </Button>
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
