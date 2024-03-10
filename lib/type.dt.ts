export type License = {
   id: number,
   licenseNum: string
   licenseName: string,
   issuedDate: number,
   expireDate: number,
   description: string,
   licenseOwner: string,
}

export type NewLicense = {
   licenseNum: string
   licenseName: string,
   description: string,
   expireDate: number,
}

export interface FileResult {
   file: File;
   metadata: {
      name: string;
      type: string;
      size: number;
      lastModified: number;
   };
}
