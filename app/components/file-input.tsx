"use client";
import { ChangeEvent, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

export default function FileInput() {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);

   const handleNewFile = (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;

      if (fileList && fileList.length > 0) {
         const file = fileList[0];
         setSelectedFile(file);
      }
   };

   const handleUploadFile = () => {};

   return (
      <div className="flex w-full flex-col items-start justify-center gap-y-4">
         <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:hover:border-gray-500 dark:hover:bg-gray-800"
         >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
               <AiOutlineCloudUpload className="h-10 w-10 text-gray-500 dark:text-gray-400" />
               <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Файл оруулах хэсэг</span>
               </p>
            </div>
            <input
               id="dropzone-file"
               type="file"
               accept="application/pdf"
               className="hidden"
               onChange={handleNewFile}
            />
         </label>
         <button
            className="w-full rounded-md bg-gray-800 px-4 py-2 hover:opacity-70"
            onClick={handleUploadFile}
         >
            Шалгах
         </button>
      </div>
   );
}
