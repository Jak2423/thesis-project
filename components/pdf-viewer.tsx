"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export default function PdfViewer({ url }: { url: string }) {
   const [numPages, setNumPages] = useState<number>(0);
   const [zoom, setZoom] = useState<number>(1);
   const [pageNumber, setPageNumber] = useState<number>(1);

   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
   };

   const nextPage = () => {
      setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);
   };

   const prevPage = () => {
      setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
   };

   const zoomIn = () => {
      if (zoom < 4) {
         setZoom(zoom + 1);
      }
   };

   const zoomOut = () => {
      if (zoom > 1) {
         setZoom(zoom - 1);
      }
   };

   return (
      <div className="relative pb-8 text-gray-900 shadow-lg">
         <Document
            file={url}
            onContextMenu={(e) => e.preventDefault()}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex gap-x-2 overflow-auto"
         >
            <Page
               scale={zoom}
               pageNumber={pageNumber}
               renderTextLayer={false}
               renderAnnotationLayer={false}
            />
         </Document>
         <div className="fixed inset-x-0 bottom-0 mb-2 flex w-full items-center justify-center gap-x-4 border-t border-gray-200 bg-gray-50 py-2 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
            <Button
               onClick={prevPage}
               disabled={pageNumber === 1}
               variant="ghost"
               size="icon"
            >
               <ChevronLeftIcon className="size-5" />
            </Button>
            <p className="flex w-24 items-center justify-center">
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
