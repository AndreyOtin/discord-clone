import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadError((err) => {
      console.log('ererrrrr', err);
    })
    .onUploadComplete(() => {
      console.log('');
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
