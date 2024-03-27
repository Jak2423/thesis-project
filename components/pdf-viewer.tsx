"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export default function PdfViewer({ url }: { url: string }) {
   const [numPages, setNumPages] = useState<number>(0);
   const [pageNumber, setPageNumber] = useState<number>(1);

   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
   };

   const nextPage = () => {
      if (pageNumber < numPages) {
         setPageNumber(pageNumber + 1);
      }
   };
   const prevPage = () => {
      if (pageNumber > 1) {
         setPageNumber(pageNumber - 1);
      }
   };

   return (
      <div className="relative text-gray-900">
         <Document
            file={{ url: url }}
            onContextMenu={(e) => e.preventDefault()}
            onLoadSuccess={onDocumentLoadSuccess}
         >
            <Page
               pageNumber={pageNumber}
               renderTextLayer={false}
               renderAnnotationLayer={false}
            />
         </Document>
         <div className="absolute inset-x-0 bottom-0 mb-2 flex w-full items-center justify-center gap-x-4">
            <Button
               onClick={prevPage}
               disabled={pageNumber === 1}
               variant="ghost"
               size="icon"
            >
               <ChevronLeftIcon className="size-5" />
            </Button>
            <p>
               {pageNumber} / {numPages}
            </p>
            <Button
               onClick={nextPage}
               variant="ghost"
               disabled={pageNumber === numPages}
               size="icon"
            >
               <ChevronRightIcon className="size-5" />
            </Button>
         </div>
      </div>
   );
}
