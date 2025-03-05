import type { Server } from "@workspace/db";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "editServer" | "members";

type ModalData = {
  server?: Server;
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
