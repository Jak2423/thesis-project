"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { addLicense } from "@/services/blockchain";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
   licenseNum: z.string().min(2, {
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

export default function CreateLicense() {
   const [uploadedFile, setUploadedFile] = useState<File | null>(null);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
   });

   function handleUploadFile(event: ChangeEvent<HTMLInputElement>) {
      const fileList = event.target.files;

      if (fileList && fileList.length > 0) {
         const file = fileList[0];
         setUploadedFile(file);
      }
      console.log(fileList);
   }

   async function onSubmit(data: z.infer<typeof formSchema>) {
      const id = await addLicense({
         licenseName: data.licenseName,
         licenseNum: data.licenseNum,
         description: data.description,
         expireDate: Number(data.expireDate),
      });
      console.log(id);
   }
   return (
      <main className="mx-auto flex w-full flex-col items-start lg:max-w-screen-lg">
         <div className="mb-8 w-full border-b border-gray-600 py-4">
            <h1 className="text-xl font-semibold">Лиценз бүртгүүлэх</h1>
         </div>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="w-2/3 space-y-8"
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
                                       "w-[240px] pl-3 text-left font-normal",
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
               <Button type="submit" size={"lg"}>
                  Бүртгүүлэх
               </Button>
            </form>
         </Form>
      </main>
   );
}
