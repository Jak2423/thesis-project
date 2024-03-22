export type License = {
   licenseNumber: number,
   fileId: string,
   owner: string,
   fileName: string,
   description: string,
   category: string,
   fileHash: string,
   isPublic: boolean,
   createdAt: number,
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