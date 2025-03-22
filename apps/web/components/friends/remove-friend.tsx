"use client";

import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";

import { useModal } from "@/hooks/use-modal-store";

type RemoveFriendProps = {
  friendshipId: string;
  username: string;
};

export const RemoveFriend: React.FC<RemoveFriendProps> = ({
  friendshipId,
  username,
}) => {
  const { onOpen } = useModal();

  return (
    <DropdownMenuItem
      onClick={() => onOpen("removeFriend", { friendshipId, username })}
      className="cursor-pointer text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20"
    >
      Remove Friend
    </DropdownMenuItem>
  );
};
