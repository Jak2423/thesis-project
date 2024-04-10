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
import { zodResolver } from "@hookform/resolvers/zod";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { ChangeEvent, useRef, useState } from "react";
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
      message: "Файлын нэрийг оруулна уу.",
   }),
   description: z
      .string()
      .min(1, {
         message: "Файлын дэлгэрэнгүй тайлбар оруулна уу.",
      })
      .max(160, {
         message: "Файлын дэлгэрэнгүй тайлбар оруулна уу.",
      }),
   category: z.string({ required_error: "Файлын төрлийг сонгоно уу." }),
   uploadedFile: z.any(),
   isPublic: z.boolean(),
});

export default function Page() {
   const [uploading, setUploading] = useState(false);
   const [file, setFile] = useState<File | null>(null);
   const { connect } = useConnect();
   const { toast } = useToast();
   const [acceptedFileType, setAcceptedFileType] = useState<string>("");
   const fileInputRef = useRef<HTMLInputElement>(null);

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
      formData.append("file", file, file.name);

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
         setUploading(true);
         const litNodeClient = new LitJsSdk.LitNodeClient({
            litNetwork: "cayenne",
         });

         await litNodeClient.connect();
         const authSig = await LitJsSdk.checkAndSignAuthMessage({
            chain: "ethereum",
            nonce: litNodeClient.getLatestBlockhash() as string,
         });

         const accs = [
            {
               contractAddress: "",
               standardContractType: "",
               chain: "ethereum",
               method: "eth_getBalance",
               parameters: [":userAddress", "latest"],
               returnValueTest: {
                  comparator: ">=",
                  value: "0",
               },
            },
         ];

         const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
            accessControlConditions: accs,
            authSig,
            chain: "ethereum",
            file: file,
            litNodeClient: litNodeClient,
            readme: "Use IPFS CID of this file to decrypt it",
         });

         const encryptedBlob = new Blob([encryptedZip], {
            type: "text/plain",
         });
         const encryptedFile = new File([encryptedBlob], file.name);

         const res = await pinFileToIPFS(encryptedFile);

         if (!res.isDuplicate) {
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

         setUploading(false);
      } catch (error) {
         console.error(error);
      }
   }

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
                              <Textarea className="resize-none" {...field} />
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
                           <FormLabel>Category</FormLabel>
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
                                 onChange={handleUploadFile}
                                 className="file:text-gray-900 file:dark:text-gray-200"
                                 disabled={!acceptedFileType}
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
