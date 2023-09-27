import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadError(() => undefined)
    .onUploadComplete(() => undefined)
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
