import Image from "next/image";

const PDFThumbnail = ({ pdfUrl }: { pdfUrl: string }) => {
   const loader = ({ src }: { src: string }) => {
      return `https://pdf-renderer.anthavio.com/render/?url=${encodeURIComponent(src)}&page=1&thumbnailWidth=200`;
   };

   return (
      <Image
         src={pdfUrl}
         alt="PDF Thumbnail"
         width={200}
         height={200}
         unoptimized
         loader={loader}
      />
   );
};

export default PDFThumbnail;
