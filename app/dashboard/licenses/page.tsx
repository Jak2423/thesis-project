"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import PreviewFile from "@/components/preview-file";
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
   DialogTrigger,
} from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";
import { ScreenHeader } from "@/components/ui/screen-header";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { License } from "@/lib/type";
import { convertTimestampToDate } from "@/lib/utils";
import { ArrowRightIcon, DownloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
   FaFileAudio,
   FaFileImage,
   FaFileLines,
   FaFileVideo,
} from "react-icons/fa6";

import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const { address } = useAccount();
   const { data: userLicenses } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getAllUserLicenses",
      account: address,
   }) as { data: License[] };

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
         <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4  lg:grid-cols-5">
            {userLicenses &&
               userLicenses.toReversed().map((l, i) => (
                  <Card className="w-full" key={i}>
                     <CardHeader>
                        <CardTitle className="truncate">{l.fileName}</CardTitle>
                        <CardDescription className="truncate">
                           {l.description}
                        </CardDescription>
                     </CardHeader>
                     <Dialog>
                        <DialogTrigger asChild>
                           <CardContent className="flex w-full items-center justify-center hover:cursor-pointer">
                              {(l.category === "PDF" && (
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
                                 ))}
                           </CardContent>
                        </DialogTrigger>
                        <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-16 text-gray-100 backdrop-blur-sm dark:bg-transparent">
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
               ))}
         </div>
      </main>
   );
}
