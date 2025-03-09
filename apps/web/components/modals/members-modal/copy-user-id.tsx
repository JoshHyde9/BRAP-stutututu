"use client";

import { IdCard } from "lucide-react";

import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";

type CopyUserIdProps = {
  userId: string;
};

export const CopyUserId: React.FC<CopyUserIdProps> = ({ userId }) => {

  const onCopy = async (userId: string) => {
    await navigator.clipboard.writeText(userId);
  };

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={() => onCopy(userId)}>
      <IdCard className="mr-2 size-4" />
      Copy User ID
    </DropdownMenuItem>
  );
};
