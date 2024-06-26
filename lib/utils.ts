import { clsx, type ClassValue } from "clsx";
import crypto from 'crypto';
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function convertTimestampToDate(timestamp: number): Date {
   const date = new Date(timestamp * 1000);

   return date;
}

export function formatAddress(addr: string) {
   return `${addr?.substring(0, 7)}...${addr?.substring(addr.length - 4, addr.length)}`;
};

export function formatBytes(bytes: number, decimals?: number) {
   if (bytes == 0) return '0 Bytes';
   var k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function calculateFileHash(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
         const buffer = new Uint8Array(reader.result as ArrayBuffer);
         const hash = crypto.createHash("sha256");
         hash.update(buffer);
         resolve(hash.digest("hex"));
      };

      reader.onerror = () => {
         reject(new Error("Error reading file"));
      };

      reader.readAsArrayBuffer(file);
   });
};

export async function pinFileToIPFS(file: File): Promise<any> {
   const formData = new FormData();
   formData.append("file", file, file.name);

   const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
         method: "POST",
         headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
            pinata_secret_api_key:
               process.env.NEXT_PUBLIC_PINATA_API_SECRET!,
         },
         body: formData,
      },
   );
   return res.json();
}