"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import PreviewFile from "@/components/preview-file";
import { Button } from "@/components/ui/button";
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
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
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
import {
   convertTimestampToDate,
   formatAddress,
   formatBytes,
} from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
   FaFileAudio,
   FaFileImage,
   FaFileLines,
   FaFileVideo,
} from "react-icons/fa6";
import { IoGridOutline, IoReorderThree } from "react-icons/io5";
import { formatEther } from "viem";
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
                        <TableHead className="w-4/12 px-2 py-1 font-semibold">
                           Name
                        </TableHead>
                        <TableHead className="w-1/12 px-2 py-1 font-semibold">
                           Type
                        </TableHead>
                        <TableHead className="w-4/12 px-2 py-1 font-semibold">
                           Description
                        </TableHead>
                        <TableHead className="w-1/12 px-2 py-1 font-semibold">
                           Size
                        </TableHead>
                        <TableHead className="w-2/12 px-2 py-1 font-semibold">
                           When
                        </TableHead>
                        <TableHead className=" px-2 py-1 font-semibold"></TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {userFiles &&
                        userFiles.toReversed().map((f) => (
                           <Dialog key={f.id}>
                              <TableRow className="border-gray-200 dark:border-gray-800">
                                 <DialogTrigger asChild>
                                    <TableCell className="line-clamp-1 flex items-center gap-x-2 font-semibold leading-8">
                                       {(f.category === "PDF" && (
                                          <FaFileLines className="size-4" />
                                       )) ||
                                          (f.category === "Image" && (
                                             <FaFileImage className="size-4" />
                                          )) ||
                                          (f.category === "Video" && (
                                             <FaFileVideo className="size-4" />
                                          )) ||
                                          (f.category === "Audio" && (
                                             <FaFileAudio className="size-4" />
                                          ))}
                                       {f.fileName}
                                    </TableCell>
                                 </DialogTrigger>
                                 <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-4 text-gray-100 backdrop-blur-sm dark:bg-transparent md:px-16">
                                    <DialogHeader className="row-span-1">
                                       <DialogTitle>{f.fileName}</DialogTitle>
                                    </DialogHeader>
                                    <PreviewFile
                                       cid={f.fileCid}
                                       type={f.category}
                                    />
                                 </DialogContent>
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
                                       "PP",
                                    )}
                                 </TableCell>
                                 <TableCell>
                                    <Sheet>
                                       <SheetTrigger asChild>
                                          <Button
                                             variant="ghost"
                                             size="icon"
                                             className="size-8 rounded-full"
                                          >
                                             <InfoCircledIcon className="size-5" />
                                          </Button>
                                       </SheetTrigger>
                                       <SheetContent className="border-gray-200 dark:border-gray-800">
                                          <SheetHeader className="mb-8">
                                             <SheetTitle>
                                                {f.fileName}
                                             </SheetTitle>
                                             <SheetDescription>
                                                {f.description}
                                             </SheetDescription>
                                          </SheetHeader>
                                          <div className="flex flex-col gap-y-4 border-t border-gray-200 py-4 dark:border-gray-800">
                                             <h3 className="text-lg font-bold">
                                                File details
                                             </h3>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Owner address
                                                </span>
                                                <span className="truncate text-sm font-light">
                                                   {formatAddress(f.fileOwner)}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Type
                                                </span>
                                                <span className="text-sm font-light">
                                                   {f.category}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Size
                                                </span>
                                                <span className="text-sm font-light">
                                                   {formatBytes(
                                                      Number(f.fileSize),
                                                   )}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Uploaded at
                                                </span>
                                                <span className="text-sm font-light">
                                                   {format(
                                                      convertTimestampToDate(
                                                         Number(f.createdAt),
                                                      ),
                                                      "PPpp",
                                                   )}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Price
                                                </span>
                                                <span className="text-sm font-light">
                                                   {formatEther(
                                                      BigInt(f.price),
                                                   )}{" "}
                                                   ETH
                                                </span>
                                             </div>
                                          </div>
                                       </SheetContent>
                                    </Sheet>
                                 </TableCell>
                              </TableRow>
                           </Dialog>
                        ))}
                  </TableBody>
               </Table>
            </TabsContent>
            <TabsContent value="grid">
               <div className="relative grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {isLoading ? (
                     <FileCardsSkeleton />
                  ) : (
                     userFiles &&
                     userFiles.toReversed().map((f, i) => (
                        <Dialog key={i}>
                           <Card className="w-full">
                              <CardHeader className="px-4">
                                 <div className="flex items-center justify-between gap-x-2">
                                    <CardTitle className="truncate">
                                       {f.fileName}
                                    </CardTitle>
                                    <Sheet>
                                       <SheetTrigger asChild>
                                          <Button
                                             variant="ghost"
                                             size="icon"
                                             className="size-8 rounded-full"
                                          >
                                             <InfoCircledIcon className="size-5" />
                                          </Button>
                                       </SheetTrigger>
                                       <SheetContent className="border-gray-200 dark:border-gray-800">
                                          <SheetHeader className="mb-8">
                                             <SheetTitle>
                                                {f.fileName}
                                             </SheetTitle>
                                             <SheetDescription>
                                                {f.description}
                                             </SheetDescription>
                                          </SheetHeader>
                                          <div className="flex flex-col gap-y-4 border-t border-gray-200 py-4 dark:border-gray-800">
                                             <h3 className="text-lg font-bold">
                                                File details
                                             </h3>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Owner address
                                                </span>
                                                <span className="truncate text-sm font-light">
                                                   {formatAddress(f.fileOwner)}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Type
                                                </span>
                                                <span className="text-sm font-light">
                                                   {f.category}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Size
                                                </span>
                                                <span className="text-sm font-light">
                                                   {formatBytes(
                                                      Number(f.fileSize),
                                                   )}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Uploaded at
                                                </span>
                                                <span className="text-sm font-light">
                                                   {format(
                                                      convertTimestampToDate(
                                                         Number(f.createdAt),
                                                      ),
                                                      "PPpp",
                                                   )}
                                                </span>
                                             </div>
                                             <div className="flex flex-col gap-x-2">
                                                <span className="text-sm font-semibold">
                                                   Price
                                                </span>
                                                <span className="text-sm font-light">
                                                   {formatEther(
                                                      BigInt(f.price),
                                                   )}{" "}
                                                   ETH
                                                </span>
                                             </div>
                                          </div>
                                       </SheetContent>
                                    </Sheet>
                                 </div>
                                 <CardDescription className="truncate">
                                    {f.description}
                                 </CardDescription>
                              </CardHeader>
                              <DialogTrigger asChild>
                                 <CardContent className="flex w-full items-center justify-center pb-8 transition-all duration-150 ease-in-out hover:cursor-pointer hover:opacity-70">
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
                              </DialogTrigger>
                              <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-4 text-gray-100 backdrop-blur-sm dark:bg-transparent md:px-16">
                                 <DialogHeader className="row-span-1">
                                    <DialogTitle>{f.fileName}</DialogTitle>
                                 </DialogHeader>
                                 <PreviewFile
                                    cid={f.fileCid}
                                    type={f.category}
                                 />
                              </DialogContent>
                           </Card>
                        </Dialog>
                     ))
                  )}
               </div>
            </TabsContent>
         </Tabs>
      </main>
   );
}
