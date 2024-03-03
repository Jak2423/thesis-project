import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { sepolia } from "wagmi/chains";
import "./globals.css";


const queryClient = new QueryClient()

const config = getDefaultConfig({
   appName: "My RainbowKit App",
   projectId: "",
   chains: [sepolia],
   ssr: true,
});


export default function ContextProvider({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      // <WagmiProvider config= { config } >
      // <QueryClientProvider client={ queryClient }>
      //    <RainbowKitProvider>
      //    { children }
      //    < /RainbowKitProvider>
      //    < /QueryClientProvider>
      //    < /WagmiProvider>
      <div></div>
   )
}
