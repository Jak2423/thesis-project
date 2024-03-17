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

export const formatBalance = (rawBalance: string) => {
   const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
   return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
   const chainIdNum = parseInt(chainIdHex);
   return chainIdNum;
};

export const formatAddress = (addr: string | undefined) => {
   return `${addr?.substring(0, 8)}...`;
};

export const calculateHash = (buffer: Uint8Array): string => {
   const hash = crypto.createHash("sha256");
   hash.update(buffer);
   return hash.digest("hex");
};