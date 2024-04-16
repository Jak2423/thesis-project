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
import ScreenHeader from "@/components/ui/screen-header";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { useState } from "react";
import {
   FaFileAudio,
   FaFileImage,
   FaFilePdf,
   FaFileVideo,
} from "react-icons/fa6";

import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const { address } = useAccount();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const { data: userFiles } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getAllUserFiles",
      account: address,
   }) as { data: UploadedFile[]; isLoading: boolean; error: any };

   return (
      <main className="flex w-full flex-col items-start px-8">
         <ScreenHeader title="My Drive" />
         <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {userFiles &&
               userFiles.map((f, i) => (
                  <Dialog key={i} open={openModal} onOpenChange={setOpenModal}>
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
                           </CardContent>
                        </Card>
                     </DialogTrigger>
                     <DialogContent className="h-screen w-full max-w-screen-2xl border-none bg-transparent px-16 text-gray-100 backdrop-blur-sm dark:bg-transparent">
                        {/* <DialogHeader>
                           <DialogTitle>{f.fileName}</DialogTitle>
                        </DialogHeader> */}
                        <PreviewFile
                           cid={f.fileCid}
                           type={f.category}
                           setOpenModal={setOpenModal}
                        />
                     </DialogContent>
                  </Dialog>
               ))}
         </div>
      </main>
   );
}
