import { License } from "@/lib/type";
import { convertTimestampToDate } from "@/lib/utils";
import { format } from "date-fns";
import { Logo } from "./ui/logo";

export default function LicensePdf({ license }: { license: License }) {
   return (
      <div className="flex w-[900px] items-center justify-center bg-white p-16 tracking-normal text-black">
         <div className="relative flex w-full flex-col  border-black py-12">
            <Logo className="absolute inset-y-2.5 size-12 fill-black" />
            <div className=" my-8 flex w-full items-center justify-center">
               <h3 className="text-2xl font-bold uppercase">
                  Лицензийн тодорхойлолт
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
                     <span className="w-32">Эзэмшигч:</span>
                     <span className="font-semibold">{license.fileOwner}</span>
                  </p>
                  <p className="flex gap-x-4">
                     <span className="w-32">Файлын дугаар:</span>
                     <span className="font-semibold">
                        {Number(license.licenseNumber)}
                     </span>
                  </p>
                  <p className="flex gap-x-4">
                     <span className="w-32">Файлын хейш:</span>
                     <span className="font-semibold">{license.fileHash}</span>
                  </p>
                  <p className="flex gap-x-4">
                     <span className="w-32">Файлын нэр:</span>
                     <span className="font-semibold">{license.fileName}</span>
                  </p>
                  <p className="flex gap-x-4">
                     <span className="w-32">Файлын төрөл:</span>
                     <span className="font-semibold">{license.category}</span>
                  </p>
                  <p className="flex gap-x-4">
                     <span className="w-32">Авсан огноо:</span>
                     <span className="font-semibold">
                        {format(
                           convertTimestampToDate(Number(license.createdAt)),
                           "yyyy-MM-dd",
                        )}
                     </span>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
