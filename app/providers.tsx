"use client";

import {
   RainbowKitProvider,
   darkTheme,
   getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { sepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const config = getDefaultConfig({
   appName: "Licens",
   projectId: projectId,
   chains: [sepolia],
   ssr: true,
});

const queryClient = new QueryClient();

export function Providers({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <NextThemesProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
      >
         <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
               <RainbowKitProvider
                  modalSize="compact"
                  theme={darkTheme({
                     accentColor: "#FAFAFA",
                     borderRadius: "medium",
                     accentColorForeground: "#000",
                  })}
               >
                  {children}
               </RainbowKitProvider>
            </QueryClientProvider>
         </WagmiProvider>
      </NextThemesProvider>
   );
}
