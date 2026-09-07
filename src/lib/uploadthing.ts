import { genUploader } from "uploadthing/client";

export const { uploadFiles } = genUploader({
  url: "/api/uploadthing", // Matches Next.js Uploadthing route handler
});