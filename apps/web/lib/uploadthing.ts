import type { OurFileRouter } from "@/app/api/uploadthing/core";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "/next-api/uploadthing",
});
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "/next-api/uploadthing",
});
