import type { FileRouter } from "uploadthing/next";

import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { getServerSession } from "@/lib/get-server-session";

const f = createUploadthing();

const auth = async () => {
  const session = await getServerSession();

  if (!session) throw new UploadThingError("Unauthorized");

  return { userId: session.user.id };
};

export const ourFileRouter = {
  serverImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => await auth())
    .onUploadComplete(() => {}),
  messageFile: f({
    image: { maxFileSize: "32MB" },
    pdf: { maxFileSize: "4MB" },
  })
    .middleware(async () => await auth())
    .onUploadComplete(({ file }) => ({
      ufsUrl: file.ufsUrl,
      fileType: file.type,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
