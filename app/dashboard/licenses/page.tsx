"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import LicensePdf from "@/components/license-pdf";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ScreenHeader from "@/components/ui/screen-header";
import { contractAddress } from "@/contracts/constants";
import { License } from "@/lib/type";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useState } from "react";
import { TbFileCertificate } from "react-icons/tb";

import { useAccount, useReadContract } from "wagmi";

const license = {
   id: 2,
   owner: "0x2DADb63752B04c7A88dcB080595E8FD3A832AdA0",
   fileName: "file se",
   description:
      "Reprehenderit ea sunt anim ad consequat deserunt occaecat ex. Sint exercitation eu eu amet et mollit commodo nulla et. Quis elit in ut ea veniam et ea nisi aliquip consectetur non. Nulla amet mollit esse irure anim cillum voluptate id consectetur voluptate irure ex duis deserunt. Consequat nisi eu consectetur qui enim labore nulla. Eu laborum est anim elit dolore esse nostrud incididunt eiusmod qui ullamco reprehenderit fugiat sit dolor. Qui non et anim consectetur sunt.",
   category: "PDF",
   fileHash: "QmRPq61WNSuQTr4Cubenfar26qcTvnAUccm93Lj1zTAjAB",
   isPublic: true,
   createdAt: 1711019329,
};

export default function Page() {
   const [showPfd, setShowPdf] = useState(false);

   const { address } = useAccount();
   const {
      data: userLicenses,
      isLoading,
      error,
   } = useReadContract({
      address: contractAddress,
      abi: licenseValidationAbi.abi,
      functionName: "getAllUserLicenses",
      account: address,
   }) as { data: License[]; isLoading: boolean; error: any };

   function generatePDF() {
      const content = document.getElementById("pdf") as HTMLElement;

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
         <ScreenHeader title="My Licenses" />
         <div className="grid w-full grid-cols-2 gap-x-4 md:grid-cols-4 lg:grid-cols-5">
            {userLicenses &&
               userLicenses.map((l, i) => (
                  <Card className="w-full" key={i}>
                     <CardHeader>
                        <CardTitle className="truncate">{l.fileName}</CardTitle>
                        <CardDescription className="truncate">
                           {l.description}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="flex w-full items-center justify-center">
                        <TbFileCertificate className="size-20" />
                     </CardContent>
                     <CardFooter className="flex justify-end">
                        <Dialog>
                           <DialogTrigger asChild>
                              <Button variant="outline" className="p-2">
                                 <ArrowRightIcon className="size-4" />
                              </Button>
                           </DialogTrigger>
                           <DialogContent className="w-full max-w-[950px] pt-16 text-gray-200">
                              <LicensePdf license={l} />
                           </DialogContent>
                        </Dialog>
                     </CardFooter>
                  </Card>
               ))}
         </div>
      </main>
   );
}
