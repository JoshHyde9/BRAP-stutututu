import type {
  MemberWithUser,
  QueryParamsKeys,
  ServerWithMembers,
} from "@/lib/types";
import type { Channel, ChannelType } from "@workspace/db";

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
  | "deleteServer"
  | "editChannel"
  | "deleteChannel"
  | "messageFile"
  | "unbanUser";

type Ban = {
  user: {
    name: string;
    id: string;
    displayName: string | null;
    image: string | null;
  };
} & {
  id: string;
  createdAt: Date;
  serverId: string;
  reason: string | null;
};

export type ModalData = {
  server?: ServerWithMembers;
  userId?: string;
  member?: MemberWithUser;
  channelType?: ChannelType;
  query?: Record<QueryParamsKeys, string>;
  channel?: Channel;
  ban?: Ban;
  serverId?: string;
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
