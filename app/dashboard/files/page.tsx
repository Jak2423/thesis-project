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
import licenseValidationContract from "@/contracts/contractAddress.json";
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
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getAllPublicFiles",
   }) as { data: UploadedFile[]; isLoading: boolean; error: any };

   return (
      <main className="flex w-full flex-col items-start px-8">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Owner</TableHead>
               </TableRow>
            </TableHeader>
            {publicFiles && (
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
                        <TableCell className="line-clamp-2 text-ellipsis">
                           {f.description}
                        </TableCell>
                        <TableCell>{formatAddress(f.owner)}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            )}
         </Table>
      </main>
   );
}
