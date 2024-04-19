"use client";
import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardsSkeleton } from "@/components/ui/skeletons";
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
import { convertTimestampToDate } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

import { CiFileOn, CiImageOn, CiVideoOn, CiVolumeHigh } from "react-icons/ci";
import { useAccount, useReadContract } from "wagmi";

const categoryTypes = [
   { name: "PDF", icon: CiFileOn },
   { name: "Image", icon: CiImageOn },
   { name: "Video", icon: CiVideoOn },
   { name: "Audio", icon: CiVolumeHigh },
];

const countFilesByCategory = (files: UploadedFile[]) => {
   const categoryCounts: { [category: string]: number } = {};

   files.forEach((file) => {
      const { category } = file;
      if (categoryCounts[category]) {
         categoryCounts[category]++;
      } else {
         categoryCounts[category] = 1;
      }
   });

   return categoryCounts;
};

export default function Page() {
   const { address } = useAccount();
   const { data: userFiles, isLoading } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getAllUserFiles",
      account: address,
   }) as { data: UploadedFile[]; isLoading: boolean; error: any };

   const categoryCounts = userFiles ? countFilesByCategory(userFiles) : {};

   return (
      <main className="flex w-full flex-col items-start px-8">
         <div className="flex w-full  flex-col items-center justify-center gap-y-4">
            <div className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
               {isLoading ? (
                  <CardsSkeleton />
               ) : (
                  categoryTypes.map((c, i) => (
                     <div
                        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-6 text-gray-950 shadow dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                        key={i}
                     >
                        <div className="flex flex-col space-y-1.5 p-0">
                           <h3 className="text-xl font-semibold leading-none tracking-tight">
                              {categoryCounts[c.name] || 0}
                           </h3>
                           <p className="text-muted-foreground text-sm">
                              Total {c.name}s
                           </p>
                        </div>
                        <div className="grid size-12 place-content-center rounded-full border border-gray-200 bg-gray-100 text-gray-950 shadow dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50">
                           <c.icon className="size-5" />
                        </div>
                     </div>
                  ))
               )}
            </div>
            <Card className="w-full">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Files</CardTitle>
                  <Link href="/dashboard/drive">
                     <Button
                        variant="link"
                        className="text-gray-500 hover:no-underline hover:opacity-70 dark:text-gray-400"
                     >
                        View all
                     </Button>
                  </Link>
               </CardHeader>
               <CardContent>
                  <Table containerClassname="overflow-x-auto relative">
                     <TableHeader>
                        <TableRow>
                           <TableHead className="w-3/12 px-2 py-1 font-semibold">
                              Name
                           </TableHead>
                           <TableHead className="w-1/12 px-2 py-1 font-semibold">
                              Category
                           </TableHead>
                           <TableHead className="w-6/12 px-2 py-1 font-semibold">
                              Description
                           </TableHead>
                           <TableHead className="w-2/5 px-2 py-1 font-semibold">
                              When
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {userFiles &&
                           userFiles
                              .toReversed()
                              .map((file) => (
                                 <TableRow key={file.id}>
                                    <TableCell className="">
                                       {file.fileName}
                                    </TableCell>
                                    <TableCell className="">
                                       {file.category}
                                    </TableCell>
                                    <TableCell className="">
                                       {file.description}
                                    </TableCell>
                                    <TableCell className="">
                                       {format(
                                          convertTimestampToDate(
                                             Number(file.createdAt),
                                          ),
                                          "PPpp",
                                       )}
                                    </TableCell>
                                 </TableRow>
                              ))
                              .slice(0, 3)}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>
      </main>
   );
}
