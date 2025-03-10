import type { MemberWithUser, ServerWithMembers } from "@/lib/types";
import type { ChannelType } from "@workspace/db";

import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "editServerProfile"
  | "banMember"
  | "createChannel"
  | "leaveServer"
  | "deleteServer";

export type ModalData = {
  server?: ServerWithMembers;
  userId?: string;
  member?: MemberWithUser;
  channelType?: ChannelType;
};

type ModalStore = {
  type: ModalType | null;
  props: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  type: null,
  props: {},
  isOpen: false,
  onOpen: (type, props = {}) => set({ isOpen: true, type, props }),
  onClose: () => set({ type: null, isOpen: false }),
}));
