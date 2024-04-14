"use client";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useEffect, useState } from "react";
import PdfViewer from "./pdf-viewer";
import Spinner from "./ui/spinner";

export default function PreviewFile({
   cid,
   type,
}: {
   cid: string;
   type: string;
}) {
   const [fileURl, setFileUrl] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      const decryptFile = async (fileToDecrypt: string) => {
         try {
            setIsLoading(true);
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
            setIsLoading(false);
            setFileUrl(downloadLink.href);
            // downloadLink.download = metadata.name;
            // downloadLink.click();
         } catch (error) {
            alert("Trouble decrypting file");
            console.log(error);
         }
      };
      decryptFile(cid);
   }, [cid]);

   return (
      <div className="flex items-center justify-center overflow-auto ">
         {isLoading && <Spinner className="h-10 w-10" />}
         {fileURl &&
            ((type === "PDF" && (
               <div className="mx-auto flex w-full max-w-[450px] flex-col items-center justify-center">
                  <PdfViewer url={fileURl} />
               </div>
            )) ||
               (type === "Video" && (
                  <video className="h-auto w-full max-w-3xl" controls>
                     <source src={fileURl} type="video/mp4" />
                  </video>
               )) ||
               (type === "Image" && (
                  <img
                     src={fileURl}
                     alt="image"
                     className="w-full max-w-[450px]"
                  />
               )) ||
               (type === "Audio" && (
                  <audio src={fileURl} controls className="w-full" />
               )))}
      </div>
   );
}
