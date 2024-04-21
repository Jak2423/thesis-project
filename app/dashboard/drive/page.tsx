"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import PreviewFile from "@/components/preview-file";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScreenHeader } from "@/components/ui/screen-header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { formatAddress } from "@/lib/utils";
import {
   FaFileAudio,
   FaFileImage,
   FaFileLines,
   FaFileVideo,
} from "react-icons/fa6";
import { IoGridOutline, IoReorderThree } from "react-icons/io5";

import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const { address } = useAccount();
   const { data: userFiles } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getAllUserFiles",
      account: address,
   }) as { data: UploadedFile[]; isLoading: boolean; error: any };

   return (
      <main className="flex w-full flex-col items-start px-8">
         <Tabs defaultValue="grid" className="w-full">
            <div className="mb-8 flex items-center justify-between">
               <ScreenHeader>My Drive</ScreenHeader>
               <TabsList>
                  <TabsTrigger value="grid">
                     <IoGridOutline className="size-6" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                     <IoReorderThree className="size-6" />
                  </TabsTrigger>
               </TabsList>
            </div>
            <TabsContent value="list">
               <div className="mb-8 flex w-full flex-col gap-y-4">
                  {userFiles &&
                     userFiles.toReversed().map((f, i) => (
                        <Dialog key={i}>
                           <DialogTrigger asChild>
                              <div className="flex w-full items-center gap-x-2 border-b border-gray-800 py-4">
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
                                       Owner: {formatAddress(f.fileOwner)}
                                    </h4>
                                    <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                                       {f.description}
                                    </p>
                                 </div>
                              </div>
                           </DialogTrigger>
                           <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-16 text-gray-100 backdrop-blur-sm dark:bg-transparent">
                              <PreviewFile cid={f.fileCid} type={f.category} />
                           </DialogContent>
                        </Dialog>
                     ))}
               </div>
            </TabsContent>
            <TabsContent value="grid">
               <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                  {userFiles &&
                     userFiles.toReversed().map((f, i) => (
                        <Dialog key={i}>
                           <DialogTrigger asChild>
                              <Card className="w-full transition-all duration-150 ease-in-out hover:cursor-pointer hover:opacity-70">
                                 <CardHeader>
                                    <CardTitle className="truncate">
                                       {f.fileName}
                                    </CardTitle>
                                    <CardDescription className="truncate">
                                       {f.description}
                                    </CardDescription>
                                 </CardHeader>
                                 <CardContent className="flex w-full items-center justify-center pb-8">
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
                                 </CardContent>
                              </Card>
                           </DialogTrigger>
                           <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-16 text-gray-100 backdrop-blur-sm dark:bg-transparent">
                              <PreviewFile cid={f.fileCid} type={f.category} />
                           </DialogContent>
                        </Dialog>
                     ))}
               </div>
            </TabsContent>
         </Tabs>
      </main>
   );
}
