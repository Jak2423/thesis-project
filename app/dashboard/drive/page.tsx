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
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { ScreenHeader } from "@/components/ui/screen-header";
import { FileCardsSkeleton } from "@/components/ui/skeletons";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { convertTimestampToDate, formatBytes } from "@/lib/utils";
import { format } from "date-fns";
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
   const { data: userFiles, isLoading } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getAllUserFiles",
      account: address,
   }) as { data: UploadedFile[]; isLoading: boolean };

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
               <Table containerClassname="overflow-x-auto relative">
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-2/12 px-2 py-1 font-semibold">
                           Name
                        </TableHead>
                        <TableHead className="w-1/12 px-2 py-1 font-semibold">
                           Category
                        </TableHead>
                        <TableHead className="w-6/12 px-2 py-1 font-semibold">
                           Description
                        </TableHead>
                        <TableHead className="w-1/12 px-2 py-1 font-semibold">
                           Size
                        </TableHead>
                        <TableHead className="w-2/5 px-2 py-1 font-semibold">
                           When
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {userFiles &&
                        userFiles.toReversed().map((f, i) => (
                           <Dialog key={i}>
                              <DialogTrigger asChild>
                                 <TableRow key={f.id}>
                                    <TableCell className="line-clamp-1 leading-8">
                                       {f.fileName}
                                    </TableCell>
                                    <TableCell>{f.category}</TableCell>
                                    <TableCell className="line-clamp-1 leading-8">
                                       {f.description}
                                    </TableCell>
                                    <TableCell>
                                       {formatBytes(Number(f.fileSize))}
                                    </TableCell>
                                    <TableCell>
                                       {format(
                                          convertTimestampToDate(
                                             Number(f.createdAt),
                                          ),
                                          "PPpp",
                                       )}
                                    </TableCell>
                                 </TableRow>
                              </DialogTrigger>
                              <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-16 text-gray-100 backdrop-blur-sm dark:bg-transparent">
                                 <PreviewFile
                                    cid={f.fileCid}
                                    type={f.category}
                                 />
                              </DialogContent>
                           </Dialog>
                        ))}
                  </TableBody>
               </Table>
            </TabsContent>
            <TabsContent value="grid">
               <div className="relative grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                  {isLoading ? (
                     <FileCardsSkeleton />
                  ) : (
                     userFiles &&
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

                           <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-4 text-gray-100 backdrop-blur-sm dark:bg-transparent md:px-16">
                              <DialogHeader className="row-span-1">
                                 <DialogTitle>{f.fileName}</DialogTitle>
                              </DialogHeader>
                              <PreviewFile cid={f.fileCid} type={f.category} />
                           </DialogContent>
                        </Dialog>
                     ))
                  )}
               </div>
            </TabsContent>
         </Tabs>
      </main>
   );
}
