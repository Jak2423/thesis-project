"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import PdfIcon from "@/components/ui/pdf-icon";
import ScreenHeader from "@/components/ui/screen-header";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { UploadedFile } from "@/lib/type";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const { address } = useAccount();
   const { data: userFiles, error } = useReadContract({
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
                  <Card
                     className="w-full transition-all duration-150 ease-in-out hover:opacity-70"
                     key={i}
                  >
                     <CardHeader>
                        <CardTitle className="truncate">{f.fileName}</CardTitle>
                        <CardDescription className="truncate">
                           {f.description}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="flex w-full items-center justify-center">
                        <PdfIcon width="60" height="100%" />
                     </CardContent>
                     <CardFooter className="flex justify-end">
                        <a
                           href={`https://silver-patient-falcon-52.mypinata.cloud/ipfs/${f.fileHash}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="hover:opacity-60"
                        >
                           <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                     </CardFooter>
                  </Card>
               ))}
         </div>
      </main>
   );
}
