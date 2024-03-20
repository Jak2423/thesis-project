export type License = {
   id: number,
   licenseNum: string
   licenseName: string,
   issuedDate: number,
   expireDate: number,
   description: string,
   licenseOwner: string,
}

export type UploadedFile = {
   id: number,
   owner: string,
   fileName: string,
   description: string,
   category: string,
   fileHash: string,
   isPublic: boolean,
   createdAt: number,
}