"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseMarketplace.sol/LicenseMarketplace.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import licenseValidationContract from "@/contracts/contractAddress.json";
import lit from "@/lib/lit";
import { pinFileToIPFS } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { parseEther } from "ethers";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
   useAccount,
   useConnect,
   useReadContract,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { z } from "zod";

const formSchema = z.object({
   fileName: z.string().min(1, {
      message: "Please enter a file name.",
   }),
   description: z.string().min(1, {
      message: "Please enter a description.",
   }),
   price: z.coerce
      .number({ required_error: "Please enter a price." })
      .positive(),
   category: z.string({ required_error: "Please select a type." }),
   uploadedFile: z
      .instanceof(File, { message: "Please upload a file." })
      .refine((file) => file.size > 0, {
         message: "Please upload a file.",
      }),
   thumbnail: z.instanceof(File).nullable().optional(),
});

export default function Page() {
   const [uploading, setUploading] = useState(false);
   const { connect } = useConnect();
   const { toast } = useToast();
   const [acceptedFileType, setAcceptedFileType] = useState<string>("");
   const fileInputRef = useRef<HTMLInputElement>(null);
   const thumbnailInputRef = useRef<HTMLInputElement>(null);

   function handleCategoryChange(selectedCategory: string) {
      switch (selectedCategory) {
         case "PDF":
            setAcceptedFileType("application/pdf");
            break;
         case "Image":
            setAcceptedFileType("image/*");
            break;
         case "Video":
            setAcceptedFileType("video/*");
            break;
         case "Audio":
            setAcceptedFileType("audio/*");
            break;
         default:
            setAcceptedFileType("");
            break;
      }

      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   }

   const { writeContract, isPending, data: hash } = useWriteContract();
   const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
      hash,
   });
   const { isConnected, address } = useAccount();

   const { data: fileId, refetch } = useReadContract({
      address: licenseValidationContract.contractAddress as `0x${string}`,
      abi: licenseValidationAbi.abi,
      functionName: "getFileId",
   }) as { data: number; refetch: any };

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         fileName: "",
         description: "",
         price: 0,
      },
   });

   function handleUploadFile(event: ChangeEvent<HTMLInputElement>) {
      const selectedFile = event.target.files?.[0];
      const maxFileSize = 52428800;

      if (selectedFile && selectedFile.size > maxFileSize) {
         toast({
            variant: "destructive",
            description: "File size exceeds the maximum limit of 50MB.",
         });
         event.target.value = "";
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
         return;
      }
   }

   function handleUploadThumbnail(event: ChangeEvent<HTMLInputElement>) {
      const selectedFile = event.target.files?.[0];
      const maxFileSize = 10485760;

      if (selectedFile && selectedFile.size > maxFileSize) {
         toast({
            variant: "destructive",
            description:
               "Thumbnail file size exceeds the maximum limit of 50MB.",
         });
         event.target.value = "";
         if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = "";
         }
         return;
      }
   }

   async function onSubmit(data: z.infer<typeof formSchema>) {
      if (!isConnected) {
         connect({ connector: injected() });
      }
      setUploading(true);

      try {
         let thumbnailRes = null;
         if (data.thumbnail) {
            thumbnailRes = await pinFileToIPFS(data.thumbnail);
         }

         const encryptedFile = await lit.encryptFile(
            String(fileId),
            data.uploadedFile,
         );
         const res = await pinFileToIPFS(encryptedFile);

         if (res.isDuplicate) {
            if (fileInputRef.current) {
               fileInputRef.current.value = "";
            }
            toast({
               variant: "destructive",
               description: "This file has already been uploaded.",
            });
         } else {
            writeContract({
               abi: licenseValidationAbi.abi,
               address:
                  licenseValidationContract.contractAddress as `0x${string}`,
               functionName: "createFile",
               args: [
                  data.fileName,
                  data.description,
                  data.category,
                  res.IpfsHash,
                  data.uploadedFile.size,
                  thumbnailRes?.IpfsHash || "",
                  parseEther(String(data.price)),
               ],
            });
         }
      } catch (error) {
         console.error("Error uploading file:", error);
         toast({
            variant: "destructive",
            description:
               "An error occurred while uploading the file. Please try again.",
         });
      } finally {
         setUploading(false);
         refetch();
      }
   }

   useEffect(() => {
      if (isSuccess) {
         form.reset();
      }
   }, [isSuccess]);

   return (
      <main className="flex w-full flex-col items-start px-8">
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
         <Form {...form}>
            <form
               encType="multipart/form-data"
               method="POST"
               onSubmit={form.handleSubmit(onSubmit)}
               className="mb-8 w-full md:w-3/4"
            >
               <Card className="w-full space-y-8 px-8 py-8">
                  <FormItem>
                     <FormLabel>Your address</FormLabel>
                     <FormControl>
                        <Input defaultValue={address} disabled />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
                  <FormField
                     control={form.control}
                     name="fileName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
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
                              <Textarea className="resize-none" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="price"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Price</FormLabel>
                           <FormControl>
                              <Input {...field} type="number" step="0.01" />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="thumbnail"
                     render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                           <FormLabel>Thumbnail image</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 type="file"
                                 accept="image/*"
                                 onChange={(event) => {
                                    handleUploadThumbnail(event);
                                    form.setValue(
                                       "thumbnail",
                                       event.target.files?.[0] || null,
                                    );
                                 }}
                                 ref={thumbnailInputRef}
                                 className="file:text-gray-900 file:dark:text-gray-200"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="category"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Type</FormLabel>
                           <Select
                              defaultValue={field.value}
                              onValueChange={(value) => {
                                 form.setValue("category", value);
                                 handleCategoryChange(value);
                              }}
                           >
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value="PDF">PDF</SelectItem>
                                 <SelectItem value="Image">Image</SelectItem>
                                 <SelectItem value="Video">Video</SelectItem>
                                 <SelectItem value="Audio">Audio</SelectItem>
                              </SelectContent>
                           </Select>
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
                                 accept={acceptedFileType}
                                 onChange={(event) => {
                                    handleUploadFile(event);
                                    form.setValue(
                                       "uploadedFile",
                                       event.target.files?.[0] || null,
                                    );
                                 }}
                                 className="file:text-gray-900 file:dark:text-gray-200"
                                 disabled={!acceptedFileType}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <CardFooter className="border-t px-0 pb-0 pt-8 dark:border-gray-800">
                     <Button
                        type="submit"
                        size={"lg"}
                        disabled={isPending || uploading}
                     >
                        {isPending || uploading ? "Uploading..." : "Upload"}
                     </Button>
                  </CardFooter>
               </Card>
            </form>
         </Form>
      </main>
   );
}
