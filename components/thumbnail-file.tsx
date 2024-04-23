"use client";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { AspectRatio } from "./ui/aspect-ratio";
import Spinner from "./ui/spinner";
import { useToast } from "./ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ThumbnailFile({
   cid,
   type,
}: {
   cid: string;
   type: string;
}) {
   const [fileURl, setFileUrl] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const { toast } = useToast();

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
            toast({
               variant: "destructive",
               description: "Trouble decrypting file",
            });
            console.log(error);
         }
      };
      decryptFile(cid);
   }, [cid]);

   return (
      <div className="flex items-center justify-center overflow-auto">
         {isLoading && <Spinner className="h-10 w-10" />}
         {fileURl &&
            ((type === "PDF" && (
               <div className="mx-auto flex w-full max-w-[450px] flex-col items-center justify-center">
                  <Document
                     file={fileURl}
                     onContextMenu={(e) => e.preventDefault()}
                     className="flex gap-x-2 overflow-auto"
                  >
                     <Page
                        pageNumber={1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                     />
                  </Document>
               </div>
            )) ||
               (type === "Video" && (
                  <AspectRatio ratio={16 / 9}>
                     <video src={fileURl} controls />
                  </AspectRatio>
               )) ||
               (type === "Image" && (
                  <AspectRatio ratio={16 / 9}>
                     <Image
                        src={fileURl}
                        alt="image"
                        fill
                        className="pointer-events-none object-cover"
                     />
                  </AspectRatio>
               )) ||
               (type === "Audio" && (
                  <audio src={fileURl} controls className="w-full" />
               )))}
      </div>
   );
}
