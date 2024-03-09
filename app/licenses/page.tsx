"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseValidation.sol/LicenseValidation.json";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { contractAddress } from "@/contracts/constants";
import { License } from "@/lib/type.dt";
import { convertTimestampToDate } from "@/lib/utils";
import { format } from "date-fns";

import { useReadContract } from "wagmi";

export default function Page() {
   const { data: licenses, isLoading } = useReadContract({
      address: contractAddress,
      abi: licenseValidationAbi.abi,
      functionName: "getAllLicenses",
   }) as { data: License[]; isLoading: boolean };

   return (
      <main className="mx-auto mb-16 flex w-full flex-col items-start lg:max-w-screen-lg">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Дугаар</TableHead>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Баталгаажуулагч</TableHead>
                  <TableHead>Лицензийн тайлбар</TableHead>
                  <TableHead>Дуусах огноо</TableHead>
               </TableRow>
            </TableHeader>
            {!isLoading && (
               <TableBody>
                  {licenses.map((l, i) => (
                     <TableRow key={i}>
                        <TableCell className="font-medium">
                           {l.licenseNum}
                        </TableCell>
                        <TableCell>{l.licenseName}</TableCell>
                        <TableCell>{l.licenseOwner}</TableCell>
                        <TableCell>{l.description}</TableCell>
                        <TableCell>
                           {format(
                              convertTimestampToDate(Number(l.expireDate)),
                              "PPP",
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            )}
         </Table>
      </main>
   );
}
