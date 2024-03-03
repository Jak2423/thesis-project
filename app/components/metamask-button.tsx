"use client";
import { useSDK } from "@metamask/sdk-react";

export const MetamaskButton = () => {
   const { sdk, connected, connecting, account } = useSDK();

   const connect = async () => {
      try {
         await sdk?.connect();
      } catch (err) {
         console.warn(`No accounts found`, err);
      }
   };

   const disconnect = () => {
      if (sdk) {
         sdk.terminate();
      }
   };

   return (
      <div>
         {connected ? (
            <button
               onClick={disconnect}
               className="block w-full py-2 pl-2 pr-4 text-left text-[#F05252] hover:bg-gray-200"
            >
               Disconnect
            </button>
         ) : (
            <button disabled={connecting} onClick={connect}>
               Connect Wallet
            </button>
         )}
      </div>
   );
};
