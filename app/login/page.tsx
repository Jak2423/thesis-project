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
import Link from "next/link";
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

   function onSubmit(data: z.infer<typeof formSchema>) {}

   return (
      <main className="mx-auto flex h-screen w-full max-w-xl flex-col items-center justify-center px-8">
         <div className="w-full rounded-lg border border-gray-800 bg-gray-900 px-12 py-16">
            <div className="mb-8 flex flex-col space-y-1.5">
               <h3 className="text-lg font-semibold leading-none tracking-tight">
                  Login
               </h3>
               <p className="text-sm text-muted">
                  Enter your email and password to login.
               </p>
            </div>
            <Form {...form}>
               <form
                  className="flex w-full flex-col items-start space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
               >
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input {...field} className=" bg-gray-950" />
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
                                 type="password"
                                 {...field}
                                 className="bg-gray-950"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button
                     type="submit"
                     size={"lg"}
                     className="mb-0 w-full px-0"
                  >
                     Log in
                  </Button>
                  <span className="flex items-center gap-x-1 text-sm text-muted">
                     Already have account ?
                     <Link
                        href="/register"
                        className="hover:text-gray-50 hover:underline"
                     >
                        Register
                     </Link>
                  </span>
               </form>
            </Form>
         </div>
      </main>
   );
}
