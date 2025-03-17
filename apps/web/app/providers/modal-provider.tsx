"use client";

import { useEffect, useState } from "react";

import { CreateChannelModal } from "@/components/modals/channel/create-channel-modal";
import { DeleteChannelModal } from "@/components/modals/channel/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/channel/edit-channel-modal";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { EditServerModal } from "@/components/modals/server-settings/edit-server-modal";
import { EditServerProfileModal } from "@/components/modals/edit-server-profile";
import { InviteModal } from "@/components/modals/invite-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { BanMemberModal } from "@/components/modals/members-modal/ban-member-modal";
import { MembersModal } from "@/components/modals/members-modal/members-modal";
import { MessageFileModal } from "@/components/modals/channel/message-file";
import { UnbanUserModal } from "@/components/modals/server-settings/unban-user";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return false;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <EditServerProfileModal />
      <BanMemberModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <MessageFileModal />
      <UnbanUserModal />
    </>
  );
};
