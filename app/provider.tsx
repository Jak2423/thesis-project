"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const config = createConfig({
   chains: [sepolia],
   connectors: [injected({ target: "metaMask" })],
   transports: {
      [sepolia.id]: http(),
   },
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
                     accentColor: "hsla(0,0%,40%,.15)",
                     borderRadius: "medium",
                  })}
               >
                  {children}
               </RainbowKitProvider>
            </QueryClientProvider>
         </WagmiProvider>
      </NextThemesProvider>
   );
}
