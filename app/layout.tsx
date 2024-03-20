import GridPattern from "@/components/ui/grid-patter";
import { Providers } from "@/services/provider";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
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
               <div className="relative flex h-full min-h-screen w-full flex-col items-center leading-6 text-white">
                  <GridPattern />
                  {children}
               </div>
            </Providers>
         </body>
      </html>
   );
}
