"use client";

import type { ServerWithMembers } from "@/lib/types";

import { formatDistanceToNowStrict } from "date-fns";
import {
  Check,
  Gavel,
  IdCard,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";

import { roleIconMap } from "@/lib/iconMaps";

// TODO: Make actions functional
export const MembersModal = () => {
  const { isOpen, onClose, type, props } = useModal();

  const { server } = props as { server: ServerWithMembers };

  const isModalOpen = isOpen && type === "members";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" lg:min-w-2xl bg-white text-black dark:bg-[#2b2d31] dark:text-primary">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold dark:text-primary">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length} Members
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
                  <TableCell>{roleIconMap[member.role]}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <ActionTooltip
                          label="More Actions"
                          side="top"
                          align="center"
                        >
                          <MoreVertical className="size-4 text-zinc-500" />
                        </ActionTooltip>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side="left">
                        {server.ownerId === member.userId && (
                          <DropdownMenuItem className="cursor-pointer">
                            Edit server profile
                          </DropdownMenuItem>
                        )}
                        {server.ownerId !== member.userId && (
                          <>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                                <ShieldQuestion className="size-4 mr-2" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Shield className="size-4 mr-2" />
                                    Guest
                                    {member.role === "GUEST" && (
                                      <Check className="size-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <ShieldCheck className="size-4 mr-2" />
                                    Moderator
                                    {member.role === "MODERATOR" && (
                                      <Check className="size-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Gavel className="size-4 mr-2" /> Kick
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <IdCard className="size-4 mr-2" />
                          Copy User ID
                        </DropdownMenuItem>
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
