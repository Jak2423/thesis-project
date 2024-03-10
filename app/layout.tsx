import { Providers } from "@/services/provider";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import Navbar from "../components/navbar";
import "./globals.css";

export const metadata: Metadata = {
   title: "License Validation",
   description: "License validation with blockchain",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className="dark" suppressHydrationWarning>
         <body className="bg-gray-950">
            <Providers>
               <div className="relative flex min-h-screen w-full flex-col items-center leading-6 text-white">
                  <svg
                     className="absolute inset-0 -z-20 h-full w-full stroke-white/5 [mask-image:radial-gradient(75%_60%_at_top_center,white,transparent)]"
                     aria-hidden="true"
                  >
                     <defs>
                        <pattern
                           id="hero"
                           width="80"
                           height="80"
                           x="50%"
                           y="-1"
                           patternUnits="userSpaceOnUse"
                        >
                           <path d="M.5 200V.5H200" fill="none"></path>
                        </pattern>
                     </defs>
                     <rect
                        width="100%"
                        height="100%"
                        strokeWidth="0"
                        fill="url(#hero)"
                     ></rect>
                  </svg>
                  <div className="absolute -top-20 -z-10 hidden w-full justify-between xl:flex">
                     <img src="/images/left.svg" />
                     <img src="/images/right.svg" />
                  </div>
                  <Navbar />
                  {children}
               </div>
            </Providers>
         </body>
      </html>
   );
}
