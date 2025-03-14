"use client";

import { useState } from "react";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";

type FileUploadProps = {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (...event: unknown[]) => void;
};

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const [fileType, setFileType] = useState<string | undefined>("");

  if (value && endpoint === "messageFile" && fileType !== "application/pdf") {
    return (
      <div className="relative aspect-auto size-[400px]">
        <Image
          fill
          src={value}
          alt="Upload"
          className="h-auto w-full object-contain"
        />
        <button className="size-4" onClick={() => onChange("")}>
          <X
            className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          />
        </button>
      </div>
    );
  }

  if (value && fileType === "image/gif") {
    return (
      <div className="relative size-44">
        <Image fill src={value} alt="Upload" className="block h-auto w-full" />
        <button className="size-4" onClick={() => onChange("")}>
          <X
            className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          />
        </button>
      </div>
    );
  }

  if (value && fileType !== "application/pdf") {
    return (
      <div className="relative size-44">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button className="size-4" onClick={() => onChange("")}>
          <X
            className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          />
        </button>
      </div>
    );
  }

  if (value && fileType === "application/pdf") {
    return (
      <div className="relative mt-2 flex items-center rounded-md bg-neutral-300/10 p-2">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-discord ml-2 text-sm hover:underline dark:text-indigo-400"
        >
          {value}
        </a>
        <button className="size-4" onClick={() => onChange("")}>
          <X
            className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      className="loader ut-button:bg-discord focus-within:ut-button:ring-black ut-button:ut-readying:bg-discord/50 ut-button:ut-uploading:bg-discord/40 after:ut-button:ut-uploading:bg-discord/50 after:ut-button:bg-discord/50 cursor-pointer"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        setFileType(res?.[0]?.type);
        return onChange(res?.[0]?.ufsUrl);
      }}
      onUploadError={(error: Error) => console.log(error)}
    />
  );
};
