"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import Search from "@/components/search";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { formatAddress } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import {
   FaFileAudio,
   FaFileImage,
   FaFileLines,
   FaFileVideo,
} from "react-icons/fa6";
import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";

export default function Page({
   searchParams,
}: {
   searchParams?: {
      query?: string;
   };
}) {
   const query = searchParams?.query || "";
   const { address } = useAccount();
   const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);

   const { data: marketFiles, error } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFiles",
      account: address,
   }) as { data: UploadedFile[]; error: any };

   useEffect(() => {
      setFilteredFiles(marketFiles);
   }, [marketFiles]);

   useEffect(() => {
      if (marketFiles) {
         const filteredItems = marketFiles.filter((file) =>
            file.fileName.toLowerCase().includes(query.toLowerCase()),
         );
         setFilteredFiles(filteredItems);
      }
   }, [query, marketFiles]);

   return (
      <main className="flex w-full flex-col items-start px-8">
         <ScreenHeader className="mb-8">Marketplace</ScreenHeader>
         <Search placeholder="Хайх" />
         <Suspense>
            <Tabs defaultValue="all" className="mt-4 w-full">
               <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pdf">PDF</TabsTrigger>
                  <TabsTrigger value="image">Image</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
               </TabsList>
               <TabsContent value="all">
                  <div className="mb-8 flex w-full flex-col gap-y-4">
                     {filteredFiles &&
                        filteredFiles.toReversed().map((f, i) => (
                           <Link
                              href={`/dashboard/marketplace/${f.id}`}
                              className="flex h-36 w-full items-center gap-x-4 border-b border-gray-800 py-4"
                              key={i}
                           >
                              <div className="relative flex h-full w-1/3 items-center justify-center md:w-1/4 lg:w-1/5">
                                 {f.imgUrl ? (
                                    <AspectRatio ratio={16 / 9}>
                                       <Image
                                          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${f.imgUrl}`}
                                          alt={f.fileName}
                                          priority={true}
                                          sizes="100vw"
                                          fill
                                          quality={20}
                                          className="pointer-events-none h-full w-8 object-cover object-center"
                                       />
                                    </AspectRatio>
                                 ) : (
                                    (f.category === "PDF" && (
                                       <FaFileLines className="h-full w-full" />
                                    )) ||
                                    (f.category === "Image" && (
                                       <FaFileImage className="h-full w-full" />
                                    )) ||
                                    (f.category === "Video" && (
                                       <FaFileVideo className="h-full w-full" />
                                    )) ||
                                    (f.category === "Audio" && (
                                       <FaFileAudio className="h-full w-full" />
                                    ))
                                 )}
                              </div>
                              <div className="flex w-full flex-col justify-start gap-y-1">
                                 <h3 className="truncate break-all text-lg font-semibold tracking-tight">
                                    {f.fileName}
                                 </h3>
                                 <div className="flex gap-x-2">
                                    <span className="text-sm font-light">
                                       Owner:
                                    </span>
                                    <span className="break-words text-sm font-semibold">
                                       {f.fileOwner === address
                                          ? "You"
                                          : formatAddress(f.fileOwner)}
                                    </span>
                                 </div>
                                 <div className="flex gap-x-2">
                                    <span className="text-sm font-light">
                                       Price
                                    </span>
                                    <span className="text-sm font-semibold">
                                       {formatEther(BigInt(f.price))} ETH
                                    </span>
                                 </div>
                                 <p className="line-clamp-2 break-all text-sm text-gray-500 dark:text-gray-400">
                                    {f.description}
                                 </p>
                              </div>
                           </Link>
                        ))}
                  </div>
               </TabsContent>
               <TabsContent value="pdf">
                  <div className="mb-8 flex w-full flex-col gap-y-4">
                     {filteredFiles &&
                        filteredFiles.toReversed().map(
                           (f, i) =>
                              f.category === "PDF" && (
                                 <Link
                                    href={`/dashboard/marketplace/${f.id}`}
                                    className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                                    key={i}
                                 >
                                    <div className="">
                                       <FaFileLines className="size-24" />
                                    </div>
                                    <div className="flex w-full flex-col justify-start gap-y-1">
                                       <h3 className="truncate text-lg font-semibold tracking-tight">
                                          {f.fileName}
                                       </h3>

                                       <h4 className="text-ellipsis text-sm leading-none tracking-tight">
                                          Owner:{" "}
                                          {f.fileOwner === address
                                             ? "You"
                                             : formatAddress(f.fileOwner)}
                                       </h4>
                                       <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                          {f.description}
                                       </p>
                                    </div>
                                 </Link>
                              ),
                        )}
                  </div>
               </TabsContent>
               <TabsContent value="image">
                  <div className="mb-8 flex w-full flex-col gap-y-4">
                     {filteredFiles &&
                        filteredFiles.toReversed().map(
                           (f, i) =>
                              f.category === "Image" && (
                                 <Link
                                    href={`/dashboard/marketplace/${f.id}`}
                                    className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                                    key={i}
                                 >
                                    <div className="">
                                       <FaFileImage className="size-24" />
                                    </div>
                                    <div className="flex w-full flex-col justify-start gap-y-1">
                                       <h3 className="truncate text-lg font-semibold tracking-tight">
                                          {f.fileName}
                                       </h3>

                                       <h4 className="text-ellipsis text-sm leading-none tracking-tight">
                                          Owner:{" "}
                                          {f.fileOwner === address
                                             ? "You"
                                             : formatAddress(f.fileOwner)}
                                       </h4>
                                       <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                          {f.description}
                                       </p>
                                    </div>
                                 </Link>
                              ),
                        )}
                  </div>
               </TabsContent>
               <TabsContent value="video">
                  <div className="mb-8 flex w-full flex-col gap-y-4">
                     {filteredFiles &&
                        filteredFiles.toReversed().map(
                           (f, i) =>
                              f.category === "Video" && (
                                 <Link
                                    href={`/dashboard/marketplace/${f.id}`}
                                    className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                                    key={i}
                                 >
                                    <div className="">
                                       <FaFileVideo className="size-24" />
                                    </div>
                                    <div className="flex w-full flex-col justify-start gap-y-1">
                                       <h3 className="truncate text-lg font-semibold tracking-tight">
                                          {f.fileName}
                                       </h3>

                                       <h4 className="text-ellipsis text-sm leading-none tracking-tight">
                                          Owner:{" "}
                                          {f.fileOwner === address
                                             ? "You"
                                             : formatAddress(f.fileOwner)}
                                       </h4>
                                       <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                          {f.description}
                                       </p>
                                    </div>
                                 </Link>
                              ),
                        )}
                  </div>
               </TabsContent>
               <TabsContent value="audio">
                  <div className="mb-8 flex w-full flex-col gap-y-4">
                     {filteredFiles &&
                        filteredFiles.toReversed().map(
                           (f, i) =>
                              f.category === "Audio" && (
                                 <Link
                                    href={`/dashboard/marketplace/${f.id}`}
                                    className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                                    key={i}
                                 >
                                    <div className="">
                                       <FaFileAudio className="size-24" />
                                    </div>
                                    <div className="flex w-full flex-col justify-start gap-y-1">
                                       <h3 className="truncate text-lg font-semibold tracking-tight">
                                          {f.fileName}
                                       </h3>

                                       <h4 className="text-ellipsis text-sm leading-none tracking-tight">
                                          Owner:{" "}
                                          {f.fileOwner === address
                                             ? "You"
                                             : formatAddress(f.fileOwner)}
                                       </h4>
                                       <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                          {f.description}
                                       </p>
                                    </div>
                                 </Link>
                              ),
                        )}
                  </div>
               </TabsContent>
            </Tabs>
         </Suspense>
      </main>
   );
}
