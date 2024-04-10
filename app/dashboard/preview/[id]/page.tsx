"use client";

import PdfViewer from "@/components/pdf-viewer";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
   const [fileURl, setFileUrl] = useState<string | null>(null);
   useEffect(() => {
      const decryptFile = async (fileToDecrypt: string) => {
         try {
            const fileRes = await fetch(
               `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${fileToDecrypt}`,
            );
            const file = await fileRes.blob();

            const litNodeClient = new LitJsSdk.LitNodeClient({
               litNetwork: "cayenne",
            });
            await litNodeClient.connect();
            const authSig = await LitJsSdk.checkAndSignAuthMessage({
               chain: "ethereum",
               nonce: litNodeClient.getLatestBlockhash() as string,
            });

            const { decryptedFile, metadata } =
               await LitJsSdk.decryptZipFileWithMetadata({
                  file: file,
                  litNodeClient: litNodeClient,
                  authSig: authSig,
               });
            const blob = new Blob([decryptedFile], {
               type: "application/octet-stream",
            });

            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            setFileUrl(downloadLink.href);
            // downloadLink.download = metadata.name;
            // downloadLink.click();
         } catch (error) {
            alert("Trouble decrypting file");
            console.log(error);
         }
      };
      decryptFile(params.id);
   }, []);

   return (
      <main className="flex h-full w-full flex-col items-start px-8">
         <div className="mx-auto flex w-full max-w-[450px] flex-col items-center justify-center">
            {fileURl && <PdfViewer url={fileURl} />}
         </div>
      </main>
   );
}
