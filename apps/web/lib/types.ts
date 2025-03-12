import { Member, MemberRole, Server, User } from "@workspace/db";

export type UserInfo = Pick<
  User,
  "id" | "name" | "image" | "displayName" | "createdAt"
>;

export type MemberWithUser = Member & {
  user: UserInfo;
};

export type ServerWithMembers = Server & {
  members: MemberWithUser[];
};

export type SectionType = "channel" | "member";

export type WSMessageType = {
  id: string;
  content: string;
  fileUrl?: string;
  memberId: string;
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
  member: {
    id: string;
    nickname?: string;
    role: MemberRole;
    serverId: string;
    userId: string;
    updatedAt: Date;
    createdAt: Date;
    user: {
      id: string;
      displayName?: string;
      image?: string;
      name: string;
    };
  };
};

// TODO: add support for conversations
export type QueryParamsKeys = "channelId" | "serverId";
