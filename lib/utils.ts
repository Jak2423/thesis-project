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

export const formatAddress = (addr: string) => {
   return `${addr?.substring(0, 7)}...${addr?.substring(addr.length - 4, addr.length)}`;
};

const calculateFileHash = (file: File): Promise<string> => {
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