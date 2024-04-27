import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
   title: "License Validation",
   description: "License validation with Blockchain",
};

export const viewport: Viewport = {
   themeColor: [
      {
         color: "#0B0B0C",
         media: "(prefers-color-scheme: dark)",
      },
      {
         color: "#fcfcfc",
         media: "(prefers-color-scheme: light)",
      },
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning className={GeistSans.className}>
         <body className="bg-gray-100 tracking-tight text-gray-950 antialiased dark:bg-gray-900 dark:text-white">
            <Providers>
               <div className="relative flex h-full min-h-screen w-full flex-col items-center leading-6">
                  <Toaster />
                  {children}
               </div>
            </Providers>
         </body>
      </html>
   );
}
