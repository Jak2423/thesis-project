export type License = {
   licenseNumber: number,
   fileId: string,
   fileOwner: string,
   fileName: string,
   description: string,
   category: string,
   fileHash: string,
   isPublic: boolean,
   createdAt: number,
}

export type UploadedFile = {
   id: number,
   fileOwner: string,
   fileName: string,
   description: string,
   category: string,
   fileHash: string,
   isPublic: boolean,
   createdAt: number,
}

export type FileRequest = {
   requestId: number,
   fileId: number,
   requester: string,
   fileOwner: string,
   isApproved: boolean,
}