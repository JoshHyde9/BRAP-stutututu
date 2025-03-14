"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

type FileUploadProps = {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (...event: unknown[]) => void;
};

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split(".").pop();

  console.log(fileType)

  if (value && fileType === "gif") {
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

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
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

  if (value && fileType === "pdf") {
    return (
      <div className="relative mt-2 flex items-center rounded-md bg-neutral-300/10 p-2">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-discord hover:underline dark:text-indigo-400"
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
        onChange(res?.[0]?.ufsUrl);
      }}
      onUploadError={(error: Error) => console.log(error)}
    />
  );
};
