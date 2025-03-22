import * as z from "zod";

import { ChannelType } from "@workspace/db";

export const createNewServerSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().min(1, { message: "Server image is required." }),
});

export const createNewChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required." })
    .refine((data) => data !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  fileUrl: z.string().optional(),
});

export const messageFileSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachment is required." }),
});

export const unbanUserSchema = z.object({
  banId: z.string().uuid(),
});

export const friendRequestSchema = z.object({
  name: z.string(),
});

export const ignoreFriendRequestSchema = z.object({
  requestId: z.string(),
});

export const removeFriendSchema = z.object({
  friendshipId: z.string().optional(),
});
