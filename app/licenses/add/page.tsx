"use client";

import licenseValidationAbi from "@/artifacts/contracts/LicenseValidation.sol/LicenseValidation.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import Spinner from "@/components/ui/spinner";
import { contractAddress } from "@/contracts/constants";
import { calculateHash, cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
   useAccount,
   useWaitForTransactionReceipt,
   useWriteContract,
} from "wagmi";
import { z } from "zod";

const formSchema = z.object({
   licenseNum: z.string().min(4, {
      message: "Лицензийн дугаар оруулна уу.",
   }),
   licenseName: z.string().min(2, {
      message: "Лицензийн нэр оруулна уу.",
   }),
   description: z.string().min(2, {
      message: "Лицензийн дэлгэрэнгүй тайлбар оруулна уу.",
   }),
   // licFile: z.instanceof(File, { message: "dwf" }),
   expireDate: z.date({
      required_error: "Лицензийн дуусах огноог оруулна уу.",
   }),
});

export default function Page() {
   const [hasError, setHasError] = useState(false);
   const [pdfHash, setPdfHash] = useState<string | null>(null);
   const [file, setFile] = useState<File | null>(null);
   const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
         licenseName: "",
         licenseNum: "",
         description: "",
      },
   });

   function handleUploadFile(event: ChangeEvent<HTMLInputElement>) {
      const selectedFile = event.target.files && event.target.files[0];
      if (selectedFile) {
         setFile(selectedFile);

         const reader = new FileReader();
         reader.onload = async () => {
            const buffer = new Uint8Array(reader.result as ArrayBuffer);
            const fileHash = calculateHash(buffer);
            setPdfHash(fileHash);
         };
         reader.readAsArrayBuffer(selectedFile);
      }
   }

   function onSubmit(data: z.infer<typeof formSchema>) {
      if (isConnected) {
         writeContract({
            abi: licenseValidationAbi.abi,
            address: contractAddress,
            functionName: "addLicense",
            args: [
               data.licenseNum,
               data.licenseName,
               data.expireDate.getTime() / 1000,
               data.description,
            ],
         });

         if (isSuccess) {
            form.reset();
         }
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
               <AlertTitle>Баталгаажуулж байна</AlertTitle>
               <AlertDescription>
                  Баталгаажуулахыг хүлээж байна...
               </AlertDescription>
            </Alert>
         )}
         {isSuccess && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Амжилттай</AlertTitle>
               <AlertDescription>Лиценз амжилттай үүсгэгдлээ.</AlertDescription>
            </Alert>
         )}
         {isError && (
            <Alert className="fixed bottom-2.5 left-2.5 right-2.5 w-auto md:w-1/3">
               <CheckCircledIcon className="h-5 w-5" />
               <AlertTitle>Алдаа</AlertTitle>
               <AlertDescription>
                  Лиценз баталгаажуулахад алдаа гарлаа.
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
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-full space-y-8 md:w-2/3"
            >
               <FormField
                  control={form.control}
                  name="licenseNum"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Лицензийн дугаар</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="licenseName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Лицензийн нэр</FormLabel>
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
                        <FormLabel>Лицензийн дэлгэрэнгүй</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* <FormField
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
                              className="w-[240px] file:text-gray-200"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               /> */}
               <FormField
                  control={form.control}
                  name="expireDate"
                  render={({ field }) => (
                     <FormItem className="flex flex-col">
                        <FormLabel>Дуусах огноо</FormLabel>
                        <Popover>
                           <PopoverTrigger asChild>
                              <FormControl>
                                 <Button
                                    variant={"outline"}
                                    className={cn(
                                       "w-full pl-3 text-left font-normal md:w-[240px]",
                                       !field.value && "text-muted-foreground",
                                    )}
                                 >
                                    {field.value ? (
                                       format(field.value, "PPP")
                                    ) : (
                                       <span>Огноог сонгох</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                 </Button>
                              </FormControl>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                 mode="single"
                                 selected={field.value}
                                 onSelect={field.onChange}
                                 disabled={(date) => date < new Date()}
                                 initialFocus
                              />
                           </PopoverContent>
                        </Popover>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" size={"lg"} disabled={isPending}>
                  Үүсгэх
               </Button>
            </form>
         </Form>
      </main>
   );
}
