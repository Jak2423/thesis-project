import * as LitJsSdk from "@lit-protocol/lit-node-client";

export const decryptFile = async (fileToDecrypt: string) => {
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

      return blob;
   } catch (error) {
      alert("Trouble decrypting file");
      console.log(error);
   }
};