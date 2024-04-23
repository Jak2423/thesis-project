"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import Search from "@/components/search";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { formatAddress } from "@/lib/utils";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import {
   FaFileAudio,
   FaFileImage,
   FaFileLines,
   FaFileVideo,
} from "react-icons/fa6";
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

   const { data: marketFiles } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFiles",
      account: address,
   }) as { data: UploadedFile[] };

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
            <Tabs defaultValue="all" className="w-full">
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
                              className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                              key={i}
                           >
                              <div className="">
                                 {(f.category === "PDF" && (
                                    <FaFileLines className="size-24" />
                                 )) ||
                                    (f.category === "Image" && (
                                       <FaFileImage className="size-24" />
                                    )) ||
                                    (f.category === "Video" && (
                                       <FaFileVideo className="size-24" />
                                    )) ||
                                    (f.category === "Audio" && (
                                       <FaFileAudio className="size-24" />
                                    ))}
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
