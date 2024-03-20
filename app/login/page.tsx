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
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6),
});

export default function Page() {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   return (
      <main className="mx-auto flex h-screen w-full max-w-lg flex-col items-center justify-center px-8">
         <Form {...form}>
            <form className="flex w-full flex-col items-start space-y-4 rounded-lg border border-gray-800 bg-gray-900 px-8 py-12">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="Enter your email address"
                              className=" bg-gray-950"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="Enter password"
                              className="bg-gray-950"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               {/* <Button variant="link" size={"sm"}>
                  Reset password
               </Button> */}
               <Button type="submit" size={"lg"} className="mb-0 w-full px-0">
                  Log in
               </Button>
               <span className="flex items-center gap-2">
                  Create a account?
                  <Button variant="link" className="px-0 dark:text-gray-300">
                     Sign up
                  </Button>
               </span>
            </form>
         </Form>
      </main>
   );
}
