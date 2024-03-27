"use client";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfThumbnail({ url }: { url: string }) {
   return (
      <Document file={{ url: url }} onContextMenu={(e) => e.preventDefault()}>
         <Page
            pageNumber={1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
         />
      </Document>
   );
}
