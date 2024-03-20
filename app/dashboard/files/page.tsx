"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { contractAddress } from "@/contracts/constants";
import { UploadedFile } from "@/lib/type";
import { formatAddress } from "@/lib/utils";

import { useAccount, useReadContract } from "wagmi";

export default function Page() {
   const { address } = useAccount();
   const {
      data: publicFiles,
      isLoading,
      error,
   } = useReadContract({
      address: contractAddress,
      abi: licenseValidationAbi.abi,
      functionName: "getAllPublicFiles",
   }) as { data: UploadedFile[]; isLoading: boolean; error: any };

   return (
      <main className="mx-auto mb-16 flex w-full flex-col items-start px-8 md:px-0 lg:max-w-screen-lg">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Owner</TableHead>
               </TableRow>
            </TableHeader>
            {!isLoading && (
               <TableBody>
                  {publicFiles.map((f, i) => (
                     <TableRow key={i}>
                        <TableCell>
                           <a
                              href={`https://silver-patient-falcon-52.mypinata.cloud/ipfs/${f.fileHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              {f.fileName}
                           </a>
                        </TableCell>
                        <TableCell className="uppercase">
                           {f.category}
                        </TableCell>
                        <TableCell>{f.description}</TableCell>
                        <TableCell>{formatAddress(f.owner)}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            )}
         </Table>
      </main>
   );
}
