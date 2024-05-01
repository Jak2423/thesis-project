"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Page() {
   const router = useRouter();
   const { isConnected } = useAccount();
   const { setTheme, theme } = useTheme();

   const handleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark");
   };

   useEffect(() => {
      // if (isConnected) {
      //    router.push("/dashboard");
      // }
   }, [isConnected, router]);

   return (
      <>
         <main className="flex w-full flex-col">
            <section className="h-screen">
               <div className="flex w-full items-center justify-center">
                  <div className="md:px- flex w-full items-center  justify-between px-8 py-4 backdrop-blur-md  md:px-16">
                     <div className="">
                        <Link
                           href={"/dashboard"}
                           className="flex items-center justify-start gap-x-1"
                        >
                           <Logo className="size-10 fill-gray-950 dark:fill-gray-100" />
                           <span className="text-2xl font-semibold tracking-tighter">
                              Licens
                           </span>
                        </Link>
                     </div>
                     <div className="flex items-center gap-x-4">
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={handleTheme}
                        >
                           <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                           <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                           <span className="sr-only">Toggle theme</span>
                        </Button>
                        <Link href={"/connect"}>
                           <Button variant="outline">Connect Wallet</Button>
                        </Link>
                     </div>
                  </div>
               </div>
               <div className="grid w-full grid-cols-1 items-center justify-center gap-x-8 px-8 md:grid-cols-2 md:px-16 ">
                  <div className="mt-32 flex flex-col gap-y-6 md:mt-0 ">
                     <h1 className="text-start text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        Цахим бүтээлийн систем
                     </h1>
                     <p className="w-full pr-0 text-gray-500 dark:text-gray-300 md:pr-24">
                        Блокчэйн технологиор дамжуулан цахим бүтээлийг
                        хамгаалах, хуваалцах, хандах зөвшөөрөл олгох систем.
                     </p>
                     <Link href="/dashboard">
                        <Button className="w-full max-w-48 py-6">Турших</Button>
                     </Link>
                  </div>
                  <Image
                     src="/images/flower.png"
                     alt="flower"
                     width={0}
                     height={0}
                     sizes="100vw"
                     priority={true}
                     className="hidden h-auto w-full md:block"
                  />
               </div>
            </section>
            <Footer />
         </main>
         <div className="absolute left-0 top-0 -z-10 h-full w-full -scale-x-100 bg-[url('/images/background.webp')] bg-cover bg-right bg-no-repeat" />
      </>
   );
}
