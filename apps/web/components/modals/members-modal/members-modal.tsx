"use client";

import type { ServerWithMembers } from "@/lib/types";
import type { MemberRole } from "@workspace/db";

import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Check,
  MoreVertical,
  Plus,
  Shield,
  ShieldBan,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { CopyUserId } from "@/components/modals/members-modal/copy-user-id";
import { KickMember } from "@/components/modals/members-modal/kick-member";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { roleIconMap } from "@/lib/iconMaps";
import { api } from "@workspace/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

type EditMemberRoleSchema = {
  memberId: string;
  role: MemberRole;
};

// TODO: Make actions functional
// FIXME: REFACTOR HOLY CRAP
export const MembersModal = () => {
  const { onOpen, isOpen, onClose, type, props } = useModal();

  const { server } = props as { server: ServerWithMembers };

  const isModalOpen = isOpen && type === "members";

  const editMemberRole = async (values: EditMemberRoleSchema) => {
    const { data, error } = await api.member
      .editMemberRole({ serverId: server.id })
      .patch(values);

    if (error) throw error;

    return data;
  };

  const { mutate: mutateMemberRole } = useMutation({
    mutationFn: editMemberRole,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (server) => {
      onOpen("members", { server });
    },
  });

  const onEditMemberRole = (values: EditMemberRoleSchema) => {
    mutateMemberRole(values);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="lg:min-w-2xl dark:text-primary bg-white text-black dark:bg-[#2b2d31]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="dark:text-primary text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length}{" "}
            {server?.members.length > 1 ? "Members" : "Member"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Joined Discord</TableHead>
                <TableHead>Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {server?.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-x-2 font-medium">
                    <UserAvatar
                      src={member.user.image}
                      name={member.user.name}
                    />
                    <div className="flex flex-col gap-y-1">
                      <div className="flex items-center text-xs font-semibold">
                        <div className="flex flex-col space-y-1.5">
                          <div className="text-base">
                            {member.nickname ??
                              member.user.displayName ??
                              member.user.name}
                          </div>
                          <div className="text-zinc-500">
                            {member.user.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(member.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(member.user.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {member.role !== "GUEST" ? (
                      <ActionTooltip label={member.role.toLowerCase()}>
                        {roleIconMap[member.role]}
                      </ActionTooltip>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <ActionTooltip label="Add Roles">
                            <Plus className="ml-2 size-4 text-zinc-500 md:size-5" />
                          </ActionTooltip>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              onEditMemberRole({
                                memberId: member.id,
                                role: "MODERATOR",
                              })
                            }
                          >
                            <ShieldCheck className="mr-2 size-4" />
                            Moderator
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <ActionTooltip label="More Actions">
                          <MoreVertical className="size-4 text-zinc-500" />
                        </ActionTooltip>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        {server.ownerId === member.userId && (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              onOpen("editServerProfile", {
                                server,
                                userId: member.userId,
                              })
                            }
                          >
                            Edit Server Profile
                          </DropdownMenuItem>
                        )}
                        {server.ownerId !== member.userId && (
                          <>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex cursor-pointer items-center">
                                <ShieldQuestion className="mr-2 size-4" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      onEditMemberRole({
                                        memberId: member.id,
                                        role: "GUEST",
                                      })
                                    }
                                  >
                                    <Shield className="mr-2 size-4" />
                                    Guest
                                    {member.role === "GUEST" && (
                                      <Check className="ml-auto size-4" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      onEditMemberRole({
                                        memberId: member.id,
                                        role: "MODERATOR",
                                      })
                                    }
                                  >
                                    <ShieldCheck className="mr-2 size-4" />
                                    Moderator
                                    {member.role === "MODERATOR" && (
                                      <Check className="ml-auto size-4" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <KickMember
                              member={member}
                              server={server}
                              onOpen={onOpen}
                            />
                            <DropdownMenuItem
                              className="cursor-pointer text-rose-500 focus:bg-rose-100/90 dark:focus:bg-rose-500/20"
                              onClick={() =>
                                onOpen("banMember", { server, member })
                              }
                            >
                              <ShieldBan className="mr-2 size-4" /> Ban
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <CopyUserId userId={member.userId} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
