"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import licenseValidationContract from "@/contracts/contractAddress.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
   useAccount,
   useConnect,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { z } from "zod";

const formSchema = z.object({
   fileName: z.string().min(1, {
      message: "Файлийн нэрийг оруулна уу.",
   }),
   description: z.string().min(2, {
      message: "Файлийн дэлгэрэнгүй тайлбар оруулна уу.",
   }),
   uploadedFile: z.any(),
   isPublic: z.boolean(),
});

export default function Page() {
   const [hasError, setHasError] = useState(false);
   const [file, setFile] = useState<File | null>(null);
   const { connect } = useConnect();
   const { toast } = useToast();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const {
      writeContract,
      isPending,
      error,
      data: hash,
      isError: issueError,
   } = useWriteContract();
   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });
   const { isConnected } = useAccount();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         fileName: "",
         description: "",
         isPublic: true,
      },
   });

   function handleUploadFile(event: ChangeEvent<HTMLInputElement>) {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
         setFile(selectedFile);
      }
   }

   async function pinFileToIPFS(file: File): Promise<any> {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
         "https://api.pinata.cloud/pinning/pinFileToIPFS",
         {
            method: "POST",
            headers: {
               pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
               pinata_secret_api_key:
                  process.env.NEXT_PUBLIC_PINATA_API_SECRET!,
            },
            body: formData,
         },
      );
      return res.json();
   }

   async function onSubmit(data: z.infer<typeof formSchema>) {
      if (!isConnected) {
         connect({ connector: injected() });
      }
      try {
         if (!file) {
            return;
         }
         const res = await pinFileToIPFS(file);

         if (!res.isDuplicate) {
            writeContract({
               abi: licenseValidationAbi.abi,
               address:
                  licenseValidationContract.contractAddress as `0x${string}`,
               functionName: "createFile",
               args: [
                  data.fileName,
                  data.description,
                  "PDF",
                  res.IpfsHash,
                  data.isPublic,
               ],
            });

            if (isSuccess) {
               form.reset();
            }
         } else {
            if (fileInputRef.current) {
               fileInputRef.current.value = "";
            }

            toast({
               variant: "destructive",
               description: "This file has already been uploaded.",
            });
         }
      } catch (error) {
         console.error(error);
      }
   }

   useEffect(() => {
      setHasError(true);
   }, [error]);

   return (
      <main className="mx-auto flex w-full flex-col items-start px-8 lg:max-w-screen-lg lg:px-0">
         {isLoading && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:left-auto md:w-1/3">
               <Spinner className="h-5 w-5" />
               <AlertTitle>Баталгаажуулалт</AlertTitle>
               <AlertDescription>
                  Баталгаажуулахыг хүлээж байна...
               </AlertDescription>
            </Alert>
         )}
         {isSuccess && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:left-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Амжилттай</AlertTitle>
               <AlertDescription>
                  Файл амжилттай байршуулагдлаа.
               </AlertDescription>
            </Alert>
         )}
         {isError && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Алдаа</AlertTitle>
               <AlertDescription>
                  Файл байршуулахад алдаа гарлаа.
               </AlertDescription>
            </Alert>
         )}
         {error && (
            <Dialog open={hasError} onOpenChange={setHasError}>
               <DialogContent className="dark:text-gray-200">
                  <DialogHeader className=" overflow-auto text-ellipsis text-wrap">
                     <DialogTitle>{error?.name}</DialogTitle>
                     <DialogDescription>{error?.message}</DialogDescription>
                  </DialogHeader>
               </DialogContent>
            </Dialog>
         )}
         <Form {...form}>
            <form
               encType="multipart/form-data"
               method="POST"
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full space-y-8 md:w-2/3"
            >
               <FormField
                  control={form.control}
                  name="fileName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="uploadedFile"
                  render={({ field: { value, onChange, ...field } }) => (
                     <FormItem>
                        <FormLabel>Upload file</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type="file"
                              ref={fileInputRef}
                              accept="application/pdf"
                              onChange={handleUploadFile}
                              className="file:text-gray-200"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               {/* <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                     <FormItem className="flex flex-col">
                        <FormLabel>Visibility</FormLabel>
                        <FormControl>
                           <Switch
                              name={field.name}
                              id={field.name}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               /> */}
               <Button type="submit" size={"lg"} disabled={isPending}>
                  Upload
               </Button>
            </form>
         </Form>
      </main>
   );
}
