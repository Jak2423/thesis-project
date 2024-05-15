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
import { BiNetworkChart } from "react-icons/bi";
import { PiCubeTransparent, PiLock } from "react-icons/pi";
import { useAccount } from "wagmi";

const features = [
   {
      title: "Decentralized storage",
      description:
         "Benefit from decentralized storage on the IPFS network, ensuring data availability and resilience against single points of failure.",
      icon: BiNetworkChart,
   },
   {
      title: "Secure file encryption",
      description:
         "Encrypt digital assets using Lit Protocol, ensuring end-to-end security and data privacy.",
      icon: PiLock,
   },
   {
      title: "Transparent transactions",
      description:
         "Leverage blockchain technology for transparent and auditable transactions, providing users with a trustless environment for digital asset management.",
      icon: PiCubeTransparent,
   },
];

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
            <div className="h-screen min-h-[32rem]">
               <div className="flex w-full items-center justify-center">
                  <div className="flex w-full items-center justify-between px-8 py-4 md:px-16">
                     <Link
                        href={"/dashboard"}
                        className="flex items-center justify-start gap-x-1"
                     >
                        <Logo className="size-10 fill-gray-950 dark:fill-gray-100" />
                        <span className="text-2xl font-semibold tracking-tighter">
                           Licens
                        </span>
                     </Link>
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
                        <Link
                           href={"/connect"}
                           className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        >
                           Connect Wallet
                        </Link>
                     </div>
                  </div>
               </div>
               <div className="grid w-full grid-cols-1 items-center justify-center gap-x-8 px-8 md:grid-cols-2 md:px-16">
                  <div className="mt-32 flex flex-col gap-y-6 md:mt-0">
                     <h1 className="w-72 text-start text-3xl font-bold  tracking-tight sm:w-full md:text-5xl lg:text-6xl">
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
            </div>
            <div className="mb-32 mt-16 grid grid-cols-1 gap-24 px-8 md:grid-cols-3 md:px-16">
               {features.map((f) => (
                  <div
                     className="flex flex-col items-start gap-y-2"
                     key={f.title}
                  >
                     <f.icon className="size-6" />
                     <h3 className="text-lg font-semibold">{f.title}</h3>
                     <p className="text-sm font-light  text-gray-500 dark:text-gray-300 ">
                        {f.description}
                     </p>
                  </div>
               ))}
            </div>
            <Footer />
         </main>
         <div className="absolute left-0 top-0 -z-10 h-full w-full -scale-x-100 bg-[url('/images/background.webp')] bg-cover bg-right bg-no-repeat" />
      </>
   );
}
