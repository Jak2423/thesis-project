"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

const config = createConfig({
   chains: [sepolia],
   transports: {
      [sepolia.id]: http(),
   },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
   return (
      <WagmiProvider config={config}>
         <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
         </QueryClientProvider>
      </WagmiProvider>
   );
}
