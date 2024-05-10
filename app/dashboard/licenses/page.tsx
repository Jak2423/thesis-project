"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import PreviewFile from "@/components/preview-file";
import { FileCardsSkeleton } from "@/components/skeletons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
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
import { Logo } from "@/components/ui/logo";
import { ScreenHeader } from "@/components/ui/screen-header";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { License } from "@/lib/type";
import {
   convertTimestampToDate,
   formatAddress,
   formatBytes,
} from "@/lib/utils";
import {
   ArrowRightIcon,
   DownloadIcon,
   InfoCircledIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import {
   FaFileAudio,
   FaFileImage,
   FaFileLines,
   FaFileVideo,
} from "react-icons/fa6";
import { formatEther } from "viem";

import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const { address } = useAccount();
   const { data: userLicenses, isLoading } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getAllUserLicenses",
      account: address,
   }) as { data: License[]; isLoading: boolean };

   function generatePDF(id: string) {
      const content = document.getElementById(id) as HTMLElement;

      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;

      html2canvas(content, { width: contentWidth, height: contentHeight }).then(
         (canvas) => {
            const pdf = new jsPDF({
               orientation: "l",
               unit: "px",
               format: [contentWidth, contentHeight],
            });
            const imgData = canvas.toDataURL("image/png");

            pdf.addImage(imgData, "PNG", 0, 0, contentWidth, contentHeight);
            pdf.save("license.pdf");
         },
      );
   }

   return (
      <main className="flex w-full flex-col items-start px-8  ">
         <ScreenHeader className="mb-8">My Licenses</ScreenHeader>
         <div className="relative grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
               <FileCardsSkeleton />
            ) : (
               userLicenses &&
               userLicenses.toReversed().map((l) => (
                  <Card className="w-full" key={l.fileId}>
                     <CardHeader className="px-4">
                        <div className="flex items-center justify-between gap-x-2">
                           <CardTitle className="truncate">
                              {l.fileName}
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
                                    <SheetTitle>{l.fileName}</SheetTitle>
                                    <SheetDescription className="break-all">
                                       {l.description}
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
                                          {formatAddress(l.fileOwner)}
                                       </span>
                                    </div>
                                    <div className="flex flex-col gap-x-2">
                                       <span className="text-sm font-semibold">
                                          Type
                                       </span>
                                       <span className="text-sm font-light">
                                          {l.category}
                                       </span>
                                    </div>
                                    <div className="flex flex-col gap-x-2">
                                       <span className="text-sm font-semibold">
                                          Size
                                       </span>
                                       <span className="text-sm font-light">
                                          {formatBytes(Number(l.fileSize))}
                                       </span>
                                    </div>
                                    <div className="flex flex-col gap-x-2">
                                       <span className="text-sm font-semibold">
                                          Licensed at
                                       </span>
                                       <span className="text-sm font-light">
                                          {format(
                                             convertTimestampToDate(
                                                Number(l.createdAt),
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
                                          {formatEther(BigInt(l.price))} ETH
                                       </span>
                                    </div>
                                 </div>
                              </SheetContent>
                           </Sheet>
                        </div>
                        <CardDescription className="truncate">
                           {l.description}
                        </CardDescription>
                     </CardHeader>
                     <Dialog>
                        <DialogTrigger asChild>
                           <CardContent className="flex w-full items-center justify-center transition-all  duration-150 ease-in-out hover:cursor-pointer hover:opacity-70">
                              {l.imgUrl ? (
                                 <AspectRatio ratio={16 / 9}>
                                    <Image
                                       src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${l.imgUrl}`}
                                       alt={l.fileName}
                                       priority={true}
                                       sizes="100vw"
                                       fill
                                       quality={20}
                                       className="pointer-events-none w-full object-cover object-center"
                                    />
                                 </AspectRatio>
                              ) : (
                                 (l.category === "PDF" && (
                                    <FaFileLines className="size-24" />
                                 )) ||
                                 (l.category === "Image" && (
                                    <FaFileImage className="size-24" />
                                 )) ||
                                 (l.category === "Video" && (
                                    <FaFileVideo className="size-24" />
                                 )) ||
                                 (l.category === "Audio" && (
                                    <FaFileAudio className="size-24" />
                                 ))
                              )}
                           </CardContent>
                        </DialogTrigger>
                        <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-16 text-gray-100 backdrop-blur-sm dark:bg-transparent">
                           <DialogHeader className="row-span-1">
                              <DialogTitle>{l.fileName}</DialogTitle>
                           </DialogHeader>
                           <PreviewFile cid={l.fileCid} type={l.category} />
                        </DialogContent>
                     </Dialog>
                     <CardFooter className="flex justify-end">
                        <Dialog>
                           <DialogTrigger asChild>
                              <Button variant="outline" className="p-2">
                                 <ArrowRightIcon className="size-4" />
                              </Button>
                           </DialogTrigger>
                           <DialogContent className="w-full max-w-[950px] pt-16 text-gray-200">
                              <div
                                 className="flex w-[900px] items-center justify-center bg-white p-16 tracking-[0.1px] text-black"
                                 id={l.fileId}
                              >
                                 <div className="relative flex w-full flex-col  border-black py-12">
                                    <Logo className="absolute inset-y-2.5 size-12 fill-black" />
                                    <div className=" my-8 flex w-full items-center justify-center">
                                       <h3 className="text-2xl font-bold uppercase">
                                          Лицензийн гэрчилгээ
                                       </h3>
                                    </div>
                                    <div className="mb-8 flex justify-end">
                                       <p className="font-semibold">
                                          {format(new Date(), "yyyy.MM.dd")}
                                       </p>
                                    </div>
                                    <div className="items-start-start my-4 flex flex-col">
                                       <div className="space-y-2">
                                          <p className="flex gap-x-4">
                                             <span className="w-32">
                                                Эзэмшигч:
                                             </span>
                                             <span className="font-semibold">
                                                {l.fileOwner}
                                             </span>
                                          </p>
                                          <p className="flex gap-x-4">
                                             <span className="w-32">
                                                Лицензийн дугаар:
                                             </span>
                                             <span className="font-semibold">
                                                {Number(l.licenseNumber)}
                                             </span>
                                          </p>
                                          <p className="flex gap-x-4">
                                             <span className="w-32">
                                                Файлын хэш:
                                             </span>
                                             <span className="font-semibold">
                                                {l.fileCid}
                                             </span>
                                          </p>
                                          <p className="flex gap-x-4">
                                             <span className="w-32">
                                                Файлын нэр:
                                             </span>
                                             <span className="font-semibold">
                                                {l.fileName}
                                             </span>
                                          </p>
                                          <p className="flex gap-x-4">
                                             <span className="w-32">
                                                Файлын төрөл:
                                             </span>
                                             <span className="font-semibold">
                                                {l.category}
                                             </span>
                                          </p>
                                          <p className="flex gap-x-4">
                                             <span className="w-32">
                                                Авсан огноо:
                                             </span>
                                             <span className="font-semibold">
                                                {format(
                                                   convertTimestampToDate(
                                                      Number(l.createdAt),
                                                   ),
                                                   "yyyy-MM-dd",
                                                )}
                                             </span>
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <DialogHeader>
                                 <Button
                                    variant="outline"
                                    className="p-2"
                                    onClick={() => generatePDF(l.fileId)}
                                 >
                                    <DownloadIcon className="size-4" />
                                 </Button>
                              </DialogHeader>
                           </DialogContent>
                        </Dialog>
                     </CardFooter>
                  </Card>
               ))
            )}
         </div>
      </main>
   );
}
