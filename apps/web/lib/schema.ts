import { ChannelType } from "@workspace/db";
import * as z from "zod";

export const createNewServerSchema = z.object({
    name: z.string().min(1, { message: "Server name is required." }),
    imageUrl: z.string().min(1, { message: "Server image is required." }),
  });

export const createNewChannelSchema = z.object({
  name: z.string().min(1, { message: "Channel name is required." }).refine((data) => data !== "general", {
    message: "Channel name cannot be 'general'"
  }),
  type: z.nativeEnum(ChannelType)
})

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  fileUrl: z.string().optional(),
});

export const messageFileSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachment is required." }),
});