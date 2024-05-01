"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const config = createConfig({
   chains: [sepolia],
   transports: {
      [sepolia.id]: http(),
   },
   connectors: [injected(), walletConnect({ projectId })],
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
