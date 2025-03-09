"use client";

import type { MemberWithUser, ServerWithMembers } from "@/lib/types";

import { useMutation } from "@tanstack/react-query";
import { Gavel } from "lucide-react";

import { api } from "@workspace/api";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";

type KickMemberSchema = {
  memberId: string;
};

type KickMemberProps = {
  member: MemberWithUser;
  server: ServerWithMembers;
  onOpen: (type: "members", data?: { server: ServerWithMembers }) => void;
};

export const KickMember: React.FC<KickMemberProps> = ({
  server,
  member,
  onOpen,
}) => {
  const kickMember = async (values: KickMemberSchema) => {
    const { data, error } = await api.member
      .kickMember({ serverId: server.id })
      .patch(values);

    if (error) throw error;

    return data;
  };

  const { mutate: mutateKickMember } = useMutation({
    mutationFn: kickMember,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (server) => {
      onOpen("members", { server });
    },
  });

  const onKickMember = (values: KickMemberSchema) => {
    mutateKickMember(values);
  };

  return (
    <DropdownMenuItem
      className="cursor-pointer text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20"
      onClick={() => onKickMember({ memberId: member.id })}
    >
      <Gavel className="mr-2 size-4" /> Kick
    </DropdownMenuItem>
  );
};
