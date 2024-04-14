"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import ScreenHeader from "@/components/ui/screen-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { formatAddress } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
   FaFileAudio,
   FaFileImage,
   FaFilePdf,
   FaFileVideo,
} from "react-icons/fa6";
import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();
   const { address } = useAccount();
   const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);

   const { data: marketFiles } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getPublicFilesExceptUser",
      account: address,
   }) as { data: UploadedFile[] };

   const handleSearch = (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
         params.set("query", term);
      } else {
         params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);

      const filteredItems = marketFiles.filter((file) =>
         file.fileName.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredFiles(filteredItems);
   };

   useEffect(() => {
      setFilteredFiles(marketFiles);
   }, [marketFiles]);

   return (
      <main className="flex w-full flex-col items-start px-8">
         <ScreenHeader title="Marketplace" />
         <form className="relative mb-8 w-full flex-1">
            <input
               className="w-full rounded-md border border-gray-200 bg-transparent py-2 pl-4 pr-10 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300 "
               type="text"
               placeholder="Хайх"
               defaultValue={searchParams.get("query")?.toString()}
               onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="absolute right-0 top-0 flex h-full items-center justify-center px-2">
               <MagnifyingGlassIcon className="size-6 text-gray-300 dark:text-gray-600" />
            </button>
         </form>
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
                     filteredFiles.map((f, i) => (
                        <Link
                           href={`/dashboard/marketplace/${f.id}`}
                           className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                           key={i}
                        >
                           <div className="">
                              {(f.category === "PDF" && (
                                 <FaFilePdf className="size-24" />
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
                                 Owner: {formatAddress(f.fileOwner)}
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
                     filteredFiles.map(
                        (f, i) =>
                           f.category === "PDF" && (
                              <Link
                                 href={`/dashboard/marketplace/${f.id}`}
                                 className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4"
                                 key={i}
                              >
                                 <div className="">
                                    <FaFilePdf className="size-24" />
                                 </div>
                                 <div className="flex w-full flex-col justify-start gap-y-1">
                                    <h3 className="truncate text-lg font-semibold tracking-tight">
                                       {f.fileName}
                                    </h3>

                                    <h4 className="text-ellipsis text-sm leading-none tracking-tight">
                                       Owner: {formatAddress(f.fileOwner)}
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
                     filteredFiles.map(
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
                                       Owner: {formatAddress(f.fileOwner)}
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
                     filteredFiles.map(
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
                                       Owner: {formatAddress(f.fileOwner)}
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
                     filteredFiles.map(
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
                                       Owner: {formatAddress(f.fileOwner)}
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
      </main>
   );
}
