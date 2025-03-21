import { ChannelType, MemberRole } from "@workspace/db";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

export const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="ml-2 size-4 md:size-5 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 md:size-5 text-rose-500" />,
  };
  
  export const memberIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="mr-2 size-4 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4 md:size-5 text-rose-500" />,
  };

  export const channelIconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 size-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
  }

  export const sidebarIconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
  };