import { Providers } from "@/app/provider";
import { Toaster } from "@/components/ui/toaster";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
   title: "License Validation",
   description: "License validation with Blockchain",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
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
