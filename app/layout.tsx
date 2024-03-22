import { Providers } from "@/app/provider";
import GridPattern from "@/components/ui/grid-patter";
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
         <body className="bg-gray-950 tracking-tight antialiased">
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
