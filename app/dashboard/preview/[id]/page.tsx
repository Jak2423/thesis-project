"use client";

import PdfViewer from "@/components/pdf-viewer";

export default function Page({ params }: { params: { id: string } }) {
   return (
      <main className="flex h-full w-full flex-col items-start px-8">
         <div className="mx-auto flex w-full max-w-[450px] flex-col items-center justify-center">
            <PdfViewer
               url={`https://silver-patient-falcon-52.mypinata.cloud/ipfs/${params.id}`}
            />
         </div>
      </main>
   );
}
