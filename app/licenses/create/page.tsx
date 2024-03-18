"use client";

import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import crypto from "crypto";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
   licFile: z.instanceof(File),
});

export default function Page() {
   const [hasError, setHasError] = useState(false);
   const [pdfHash, setPdfHash] = useState<string | null>(null);
   const [file, setFile] = useState<File | null>(null);
   const [uploadedFile, setUploadedFile] = useState<File | null>(null);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
   });

   async function handleUploadFile(event: ChangeEvent<HTMLInputElement>) {
      const selectedFile = event.target.files && event.target.files[0];
      if (!selectedFile) {
         return;
      }

      setFile(selectedFile);

      try {
         const fileHash = await calculateFileHash(selectedFile);
         setPdfHash(fileHash);
         console.log(fileHash);
      } catch (error) {
         console.error("Error calculating hash:", error);
      }
   }

   const calculateFileHash = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();

         reader.onload = () => {
            const buffer = new Uint8Array(reader.result as ArrayBuffer);
            const hash = crypto.createHash("sha256");
            hash.update(buffer);
            resolve(hash.digest("hex"));
         };

         reader.onerror = () => {
            reject(new Error("Error reading file"));
         };

         reader.readAsArrayBuffer(file);
      });
   };

   function onSubmit(data: z.infer<typeof formSchema>) {}

   return (
      <main className="mx-auto flex w-full flex-col items-start px-8 lg:max-w-screen-lg lg:px-0">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full space-y-8 md:w-2/3"
            >
               <FormField
                  control={form.control}
                  name="licFile"
                  render={({ field: { value, onChange, ...field } }) => (
                     <FormItem>
                        <FormLabel>Лицензжүүлэх файл</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type="file"
                              accept="application/pdf"
                              onChange={handleUploadFile}
                              className="file:text-gray-200"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" size={"lg"}>
                  Үүсгэх
               </Button>
            </form>
         </Form>
      </main>
   );
}
